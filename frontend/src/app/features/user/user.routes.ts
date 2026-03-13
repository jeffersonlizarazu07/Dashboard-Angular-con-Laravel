import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: 'catalog',
    loadComponent: () =>
      import('./catalog/catalog.component').then(m => m.CatalogComponent)
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: '',
    redirectTo: 'catalog',
    pathMatch: 'full'
  }
];
