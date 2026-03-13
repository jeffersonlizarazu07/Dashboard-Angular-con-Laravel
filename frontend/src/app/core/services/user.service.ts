import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  /**
   * Get all users.
   */
  getAll(): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(this.apiUrl, {
      withCredentials: true
    });
  }

  /**
   * Get a single user by ID.
   */
  getById(id: number): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  /**
   * Create a new user.
   */
  create(data: Partial<User> & { password: string }): Observable<{ user: User }> {
    return this.http.post<{ user: User }>(this.apiUrl, data, {
      withCredentials: true
    });
  }

  /**
   * Update an existing user.
   */
  update(id: number, data: Partial<User>): Observable<{ user: User }> {
    return this.http.put<{ user: User }>(`${this.apiUrl}/${id}`, data, {
      withCredentials: true
    });
  }

  /**
   * Delete a user by ID.
   */
  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }
}
