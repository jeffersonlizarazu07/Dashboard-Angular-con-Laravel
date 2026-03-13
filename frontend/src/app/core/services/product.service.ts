import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductRequest } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  /**
   * Get all products.
   */
  getAll(): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(this.apiUrl, {
      withCredentials: true
    });
  }

  /**
   * Get a single product by ID.
   */
  getById(id: number): Observable<{ product: Product }> {
    return this.http.get<{ product: Product }>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  /**
   * Create a new product.
   */
  create(data: ProductRequest): Observable<{ product: Product }> {
    return this.http.post<{ product: Product }>(this.apiUrl, data, {
      withCredentials: true
    });
  }

  /**
   * Update an existing product.
   */
  update(id: number, data: Partial<ProductRequest>): Observable<{ product: Product }> {
    return this.http.put<{ product: Product }>(`${this.apiUrl}/${id}`, data, {
      withCredentials: true
    });
  }

  /**
   * Delete a product by ID.
   */
  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }
}
