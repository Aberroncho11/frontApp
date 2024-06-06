import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAdminOrGestorGuard : CanActivateFn = (route, state) => {

  // Inyectamos el servicio de autenticación y el router
  const authService = inject( AuthService );
  const router = inject( Router );

  // Obtenemos el rol del token
  const role = authService.getRoleFromToken();
  // Si el rol es Administrador o Gestor, permitimos el acceso
    if (role === 'Administrador' || role === 'Gestor') {
      return true;
    // Si el rol no es Administrador o Gestor, redirigimos a la página de la tienda
    } else {
      router.navigateByUrl('/store');
      return false;
    }
}
