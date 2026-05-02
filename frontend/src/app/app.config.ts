import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { environment } from '../environments/environment';

function initCsrf(http: HttpClient) {
  return () =>
    http
      .get(`${environment.sanctumUrl}/sanctum/csrf-cookie`, { withCredentials: true })
      .toPromise();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initCsrf,
      deps: [HttpClient],
      multi: true
    }
  ],
};
