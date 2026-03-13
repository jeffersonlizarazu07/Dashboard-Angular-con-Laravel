import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  readonly currentUser = this.authService.currentUser;

  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  profileForm!: FormGroup;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Build profile form and preload current user data.
   */
  private buildForm(): void {
    const user = this.currentUser();

    this.profileForm = this.fb.group({
      name:     [user?.name ?? '', [Validators.required, Validators.minLength(3)]],
      email:    [user?.email ?? '', [Validators.required, Validators.email]],
      password: ['', [Validators.pattern(passwordPattern)]]
    });
  }

  /**
   * Submit profile update.
   */
  onSubmit(): void {

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const user = this.currentUser();
    if (!user) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const formValue = { ...this.profileForm.value };

    if (!formValue.password) {
      delete formValue.password;
    }

    this.userService.update(user.id, formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.successMessage.set('Perfil actualizado correctamente.');
          this.profileForm.get('password')?.setValue('');
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            err.error?.message ?? 'Error al actualizar perfil.'
          );
        }
      });
  }

  get name()     { return this.profileForm.get('name'); }
  get email()    { return this.profileForm.get('email'); }
  get password() { return this.profileForm.get('password'); }

}
