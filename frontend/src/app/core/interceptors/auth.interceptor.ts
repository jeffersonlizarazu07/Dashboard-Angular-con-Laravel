import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor that attaches credentials (cookies) to every outgoing request.
 * Also reads the XSRF-TOKEN cookie and attaches it as a header for Sanctum.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const xsrfToken = getCookie('XSRF-TOKEN');

  const cloned = req.clone({
    withCredentials: true,
    setHeaders: xsrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) } : {}
  });

  return next(cloned);
};

/**
 * Read a cookie value by name from document.cookie.
 */
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}
