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
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interfaces/product.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit, OnDestroy {

  products = signal<Product[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);
  showModal = signal(false);
  editingProduct = signal<Product | null>(null);
  errorMessage = signal('');
  successMessage = signal('');

  productForm!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Build product form with validators.
   */
  private buildForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  /**
   * Load all products from API.
   */
  private loadProducts(): void {
    this.productService.getAll().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar productos.');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Open modal for creating a new product.
   */
  openCreateModal(): void {
    this.editingProduct.set(null);
    this.productForm.reset();
    this.showModal.set(true);
  }

  /**
   * Open modal for editing an existing product.
   *
   * @param product - The product to edit
   */
  openEditModal(product: Product): void {
    this.editingProduct.set(product);
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
    this.showModal.set(true);
  }

  /**
   * Close the modal and reset form.
   */
  closeModal(): void {
    this.showModal.set(false);
    this.editingProduct.set(null);
    this.productForm.reset();
    this.errorMessage.set('');
  }

  /**
   * Submit form for create or update.
   */
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const editing = this.editingProduct();

    const request$ = editing
      ? this.productService.update(editing.id, this.productForm.value)
      : this.productService.create(this.productForm.value);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMessage.set(
          editing ? 'Producto actualizado.' : 'Producto creado.'
        );
        this.closeModal();
        this.loadProducts();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message ?? 'Error al guardar producto.');
      }
    });
  }

  /**
   * Delete a product by ID.
   *
   * @param product - The product to delete
   */
  deleteProduct(product: Product): void {
    if (!confirm(`¿Eliminar el producto "${product.name}"?`)) return;

    this.productService.delete(product.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.successMessage.set('Producto eliminado.');
        this.loadProducts();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => this.errorMessage.set('Error al eliminar producto.')
    });
  }

  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get stock() { return this.productForm.get('stock'); }
}
