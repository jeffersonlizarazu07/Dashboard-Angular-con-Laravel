import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const xsrfToken = getCookie('XSRF-TOKEN');

//   const cloned = req.clone({
//     withCredentials: true,
//     setHeaders: xsrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) } : {}
//   });

//   return next(cloned);
// };

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const xsrfToken = getCookie('XSRF-TOKEN');
  console.log('Cookie cruda:', document.cookie);
  console.log('XSRF-TOKEN leído:', xsrfToken);
  console.log('Header enviado:', xsrfToken ? decodeURIComponent(xsrfToken) : 'NINGUNO');

  const cloned = req.clone({
    withCredentials: true,
    setHeaders: xsrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) } : {}
  });

  return next(cloned);
};
