export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
}
