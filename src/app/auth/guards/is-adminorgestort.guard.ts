import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAdminOrGestorGuard : CanActivateFn = (route, state) => {

  const authService = inject( AuthService );
  const router      = inject( Router );

  const role = authService.getRoleFromToken();
    console.log(role);
    if (role === 'Administrador' || role === 'Gestor') {
      return true;
    } else {
      router.navigateByUrl('/store');
      return false;
    }
}
