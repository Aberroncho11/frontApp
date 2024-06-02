import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  private authService = inject( AuthService );

  constructor() {
    this.checkRole();
  }

  public user = computed(() => this.authService.currentUser() );

  public isAdmin: boolean = false;
  public isOperador: boolean = false;
  public isGestor: boolean = false;
  public isAdminOrGestor: boolean = false;


  onLogout() {
    this.authService.logout();
  }

  private checkRole() {
    const role = this.authService.getRoleFromToken();
    this.isAdmin = role === 'Administrador';
    this.isOperador = role === 'Operador';
    this.isGestor = role === 'Gestor';
    this.isAdminOrGestor = this.isAdmin || this.isGestor;
  }
}
