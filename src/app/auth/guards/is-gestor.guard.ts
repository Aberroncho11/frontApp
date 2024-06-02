import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isGestorGuard : CanActivateFn = (route, state) => {

  const authService = inject( AuthService );
  const router      = inject( Router );

  const role = authService.getRoleFromToken();
    console.log(role);
    if (role === 'Gestor') {
      return true;
    } else {
      router.navigateByUrl('/store');
      return false;
    }
}
