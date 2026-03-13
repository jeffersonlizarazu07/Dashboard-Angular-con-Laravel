import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Cart,
  AddToCartRequest,
  CheckoutResponse
} from '../interfaces/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly apiUrl = `${environment.apiUrl}/products`;

  // Signal central del carrito
  private cartSignal = signal<Cart | null>(null);

  // Computed signals en tiempo real
  readonly cart = this.cartSignal.asReadonly();

  readonly itemCount = computed(() => {
    const items = this.cartSignal()?.items ?? [];
    return items.reduce((acc, item) => acc + item.quantity, 0);
  });

  readonly total = computed(() => {
    const items = this.cartSignal()?.items ?? [];
    return items.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity);
    }, 0);
  });

  constructor(private http: HttpClient) {}

  /**
   * Load cart from API and update signal.
   */
  loadCart(): Observable<{ cart: Cart }> {
    return this.http.get<{ cart: Cart }>(
      `${this.apiUrl}/cart`,
      { withCredentials: true }
    ).pipe(
      tap(response => this.cartSignal.set(response.cart))
    );
  }

  /**
   * Add a product to the cart.
   */
  addItem(data: AddToCartRequest): Observable<{ cart: Cart }> {
    return this.http.post<{ cart: Cart }>(
      `${this.apiUrl}/cart/add`,
      data,
      { withCredentials: true }
    ).pipe(
      tap(response => this.cartSignal.set(response.cart))
    );
  }

  /**
   * Remove an item from the cart.
   */
  removeItem(cartItemId: number): Observable<{ cart: Cart }> {
    return this.http.delete<{ cart: Cart }>(
      `${this.apiUrl}/cart/items/${cartItemId}`,
      { withCredentials: true }
    ).pipe(
      tap(response => this.cartSignal.set(response.cart))
    );
  }

  /**
   * Process checkout.
   */
  checkout(): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(
      `${this.apiUrl}/cart/checkout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => this.cartSignal.set(null))
    );
  }

  /**
   * Clear cart signal locally.
   */
  clearCart(): void {
    this.cartSignal.set(null);
  }
}
