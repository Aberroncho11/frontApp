import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isNotAuthenticatedGuard, isAuthenticatedGuard } from './auth/guards';

// Rutas de la aplicación
const routes: Routes = [
  {
    // Ruta de autenticación
    path: 'auth',
    // Cargar guard de autenticación
    canActivate: [ isNotAuthenticatedGuard ],
    // Cargar módulo de autenticación
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    // Ruta de la tienda
    path: 'store',
    // Cargar guard de autenticación
    canActivate: [ isAuthenticatedGuard ],
    // Cargar módulo de la tienda
    loadChildren: () => import('./store/store.module').then(m => m.StoreModule)
  },
  {
    // Ruta por defecto
    path: '**',
    // Redirigir a autenticación
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
