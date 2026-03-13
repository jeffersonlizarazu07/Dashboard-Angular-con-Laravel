import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interfaces/user.interface';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit, OnDestroy {

  users = signal<User[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);
  showModal = signal(false);
  editingUser = signal<User | null>(null);
  errorMessage = signal('');
  successMessage = signal('');

  userForm!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Build user form with validators.
   */
  private buildForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
      role: ['user', [Validators.required]]
    });
  }

  /**
   * Load all users from API.
   */
  private loadUsers(): void {
    this.userService.getAll().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.users.set(response.users);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar usuarios.');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Open modal for creating a new user.
   */
  openCreateModal(): void {
    this.editingUser.set(null);
    this.userForm.reset({ role: 'user' });
    this.userForm.get('password')?.setValidators([
      Validators.required,
      Validators.pattern(passwordPattern)
    ]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal.set(true);
  }

  /**
   * Open modal for editing an existing user.
   *
   * @param user - The user to edit
   */
  openEditModal(user: User): void {
    this.editingUser.set(user);
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.setValue('');
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal.set(true);
  }

  /**
   * Close the modal and reset form.
   */
  closeModal(): void {
    this.showModal.set(false);
    this.editingUser.set(null);
    this.userForm.reset({ role: 'user' });
    this.errorMessage.set('');
  }

  /**
   * Submit form for create or update.
   */
  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.userForm.value;
    const editing = this.editingUser();

    // Remove empty password on edit
    if (editing && !formValue.password) {
      delete formValue.password;
    }

    const request$ = editing
      ? this.userService.update(editing.id, formValue)
      : this.userService.create(formValue);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMessage.set(
          editing ? 'Usuario actualizado.' : 'Usuario creado.'
        );
        this.closeModal();
        this.loadUsers();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message ?? 'Error al guardar usuario.');
      }
    });
  }

  /**
   * Delete a user by ID.
   *
   * @param user - The user to delete
   */
  deleteUser(user: User): void {
    if (!confirm(`¿Eliminar al usuario "${user.name}"?`)) return;

    this.userService.delete(user.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.successMessage.set('Usuario eliminado.');
        this.loadUsers();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => this.errorMessage.set('Error al eliminar usuario.')
    });
  }

  get name() { return this.userForm.get('name'); }
  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }
  get role() { return this.userForm.get('role'); }
}
