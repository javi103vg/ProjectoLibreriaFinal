import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { authGuard, adminGuard } from './guards/guards';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter([
      {
        path: '',
        loadComponent: () => import('./pages/catalogo/catalogo.component').then(m => m.CatalogoComponent)
      },
      {
        path: 'libro/:id',
        loadComponent: () => import('./pages/libro-detalle/libro-detalle.component').then(m => m.LibroDetalleComponent)
      },
      {
        path: 'carrito',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/carrito/carrito.component').then(m => m.CarritoComponent)
      },
      {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent)
      },
      {
        path: 'mis-pedidos',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/mis-pedidos/mis-pedidos.component').then(m => m.MisPedidosComponent)
      },
      {
        path: 'auth/login',
        loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'auth/registro',
        loadComponent: () => import('./pages/auth/registro.component').then(m => m.RegistroComponent)
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/admin-libros.component').then(m => m.AdminLibrosComponent)
      },
      { path: '**', redirectTo: '' }
    ])
  ]
};
