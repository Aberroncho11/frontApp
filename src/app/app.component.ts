import { Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Inyectar authService
  private authService = inject( AuthService );

  // Inyectar router
  private router = inject( Router );

  /*
    * Método para verificar si la autenticación ha terminado
    * @returns boolean
    * @memberof AppComponent
  */
  public finishedAuthCheck = computed<boolean>( () => {
    // Si la autenticación está en proceso
    if ( this.authService.authStatus() === AuthStatus.checking ) {
      return false;
    }

    return true;
  });

  /*
    * Método para verificar si la autenticación ha terminado
    * @returns boolean
    * @memberof AppComponent
  */
  public authStatusChangedEffect = effect(() => {

    // Verificar estado de autenticación
    switch( this.authService.authStatus() ) {

      // Si la autenticación está en proceso
      case AuthStatus.checking:
        return;

      // Si el usuario está autenticado
      case AuthStatus.authenticated:
        this.router.navigateByUrl('/store');
        return;

      // Si el usuario no está autenticado
      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/auth/login');
        return;
    }
  });

}
