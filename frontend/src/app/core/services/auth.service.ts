import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = environment.apiUrl;
  private readonly sanctumUrl = environment.sanctumUrl;

  // Signal central del usuario autenticado
  private currentUserSignal = signal<User | null>(null);

  // Computed signals derivados del usuario
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  /**
   * Fetch CSRF cookie from Sanctum before any state-changing request.
   */
  getCsrfCookie(): Observable<void> {
    // #region agent log
    fetch('http://127.0.0.1:7788/ingest/9dd0ed2f-e734-4b9b-aea3-7e346eaf6a22', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '8d12e3' },
      body: JSON.stringify({
        sessionId: '8d12e3',
        runId: 'pre-fix',
        hypothesisId: 'H2',
        location: 'src/app/core/services/auth.service.ts:getCsrfCookie',
        message: 'Fetching CSRF cookie',
        data: { url: `${this.sanctumUrl}/sanctum/csrf-cookie`, withCredentials: true },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log
    return this.http.get<void>(`${this.sanctumUrl}/sanctum/csrf-cookie`, {
      withCredentials: true
    });
  }

  /**
   * Register a new user.
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    // #region agent log
    fetch('http://127.0.0.1:7788/ingest/9dd0ed2f-e734-4b9b-aea3-7e346eaf6a22', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '8d12e3' },
      body: JSON.stringify({
        sessionId: '8d12e3',
        runId: 'pre-fix',
        hypothesisId: 'H2',
        location: 'src/app/core/services/auth.service.ts:register',
        message: 'Register request',
        data: { url: `${this.apiUrl}/auth/register`, withCredentials: true },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/register`,
      data,
      { withCredentials: true }
    ).pipe(
      tap(response => this.setUser(response.user))
    );
  }

  /**
   * Login with email and password.
   */
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/login`,
      data,
      { withCredentials: true }
    ).pipe(
      tap(response => this.setUser(response.user))
    );
  }

  /**
   * Logout and clear session.
   */
  logout(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => this.clearUser())
    );
  }

  /**
   * Get current authenticated user from API.
   */
  me(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(
      `${this.apiUrl}/auth/me`,
      { withCredentials: true }
    ).pipe(
      tap(response => this.setUser(response.user))
    );
  }

  /**
   * Set user in signal and localStorage.
   */
  private setUser(user: User): void {
    this.currentUserSignal.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Clear user from signal and localStorage.
   */
  private clearUser(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  /**
   * Load user from localStorage on app init.
   */
  private loadUserFromStorage(): void {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUserSignal.set(JSON.parse(stored));
    }
  }
}
