import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  inject
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/interfaces/product.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog.component.html',
})
export class CatalogComponent implements OnInit, OnDestroy {

  private productService = inject(ProductService);
  private cartService = inject(CartService);

  products = signal<Product[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');

  // Exponer el contador del carrito al template
  readonly itemCount = this.cartService.itemCount;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all products from the API.
   */
  private loadProducts(): void {
    this.productService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.products.set(response.products);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Error al cargar los productos.');
          this.isLoading.set(false);
        }
      });
  }

  /**
   * Add a product to the cart.
   */
  addToCart(product: Product): void {

    this.cartService.addItem({
      product_id: product.id,
      quantity: 1
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.successMessage.set(`"${product.name}" agregado al carrito.`);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => {
        this.errorMessage.set('Error al agregar al carrito.');
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

}
