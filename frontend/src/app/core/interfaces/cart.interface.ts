import { Product } from './product.interface';

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface CheckoutResponse {
  message: string;
  total: number;
}
