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
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/interfaces/cart.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit, OnDestroy {

  private cartService = inject(CartService);

  isLoading = signal(true);
  isCheckingOut = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Signals del carrito en tiempo real
  readonly cart = this.cartService.cart;
  readonly itemCount = this.cartService.itemCount;
  readonly total = this.cartService.total;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load cart data from API.
   */
  private loadCart(): void {
    this.cartService.loadCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.isLoading.set(false),
        error: () => {
          this.errorMessage.set('Error al cargar el carrito.');
          this.isLoading.set(false);
        }
      });
  }

  /**
   * Remove an item from the cart.
   */
  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => this.errorMessage.set('Error al eliminar el producto.')
      });
  }

  /**
   * Process checkout for all items in the cart.
   */
  checkout(): void {

    this.isCheckingOut.set(true);
    this.errorMessage.set('');

    this.cartService.checkout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isCheckingOut.set(false);
          this.successMessage.set(
            `${response.message} Total pagado: $${response.total}`
          );
        },
        error: (err) => {
          this.isCheckingOut.set(false);
          this.errorMessage.set(
            err.error?.message ?? 'Error al procesar la compra.'
          );
        }
      });
  }

}
