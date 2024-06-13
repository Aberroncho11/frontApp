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

  private authService = inject( AuthService );

  /*
    * Método para verificar si la autenticación ha terminado
    * @returns boolean
    * @memberof AppComponent
  */
  public finishedAuthCheck = computed<boolean>( () => {
    if ( this.authService.authStatus() === AuthStatus.checking ) {
      return false;
    }

    return true;
  });

<<<<<<< HEAD
=======
  /*
    * Método para verificar si la autenticación ha terminado
    * @returns boolean
    * @memberof AppComponent
  */
  // public authStatusChangedEffect = effect(() => {

  //   switch( this.authService.authStatus() ) {

  //     case AuthStatus.checking:
  //       return;

  //     case AuthStatus.authenticated:
  //       this.router.navigateByUrl('/store');
  //       return;

  //     case AuthStatus.notAuthenticated:
  //       this.router.navigateByUrl('/auth/login');
  //       return;
  //   }
  // });
>>>>>>> f03d08c574775c7539a261ca246daa280e009f81

}
