import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  // Inyectamos el servicio de autenticación y el router
  const authService = inject( AuthService );
  const router = inject( Router );

  // Si el usuario está autenticado, permitimos el acceso
  if ( authService.authStatus() === AuthStatus.authenticated ) {
    return true;
  }
  // Si el usuario no está autenticado, redirigimos a la página de login
  else{
    router.navigateByUrl('/auth/login');
    return false;
  }

};
