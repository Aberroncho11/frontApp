import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';


export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {

  // Inyectamos el servicio de autenticación y el router
  const authService = inject( AuthService );
  const router = inject( Router );

  // Si el usuario está autenticado, redirigimos a la página de la tienda
  if ( authService.authStatus() === AuthStatus.authenticated ) {
    router.navigateByUrl('/store');
    return false;
  }

  return true;
};
