import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  // Inyectamos el servicio AuthService
  private authService = inject( AuthService );

  // Constructor
  constructor() {
    // Comprobamos el rol del usuario
    this.checkRole();
  }

  // Propiedades reactivas
  public user = computed(() => this.authService.currentUser() );

  // Propiedades de estado
  public isAdmin: boolean = false;

  public isOperador: boolean = false;

  public isGestor: boolean = false;

  public isAdminOrGestor: boolean = false;

  /**
   * Método para cerrar sesión
   * @memberof HeaderComponent
   * @returns void
   */
  onLogout(): void {
    // Cerramos la sesión
    this.authService.logout();
  }

  // Método para comprobar el rol del usuario
  private checkRole() {
    // Obtenemos el rol del usuario
    const role = this.authService.getRoleFromToken();
    // Comprobamos el rol del usuario
    this.isAdmin = role === 'Administrador';
    this.isOperador = role === 'Operador';
    this.isGestor = role === 'Gestor';
    this.isAdminOrGestor = this.isAdmin || this.isGestor;
  }
}
