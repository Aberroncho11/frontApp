import { Component, computed } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'inicio-page',
  templateUrl: './inicio-page.component.html',
  styleUrls: ['./inicio-page.component.css']

})
export class InicioPageComponent {

  // Variable para el manejo de la carga
  public isLoading = true;

  // Constructor
  constructor(private authService: AuthService) {
    // Comprobar el rol del usuario
    this.checkRole();
  }

  // Getter para obtener el usuario
  public user = computed(() => this.authService.currentUser() );

  // Variables para el manejo de los roles
  public isAdmin: boolean = false;
  public isOperador: boolean = false;
  public isGestor: boolean = false;
  public isAdminOrGestor: boolean = false;

  /**
   * Método para comprobar el rol del usuario
   * @returns void
   * @memberof InicioPageComponent
   */
  private checkRole(): void{
    // Obtener el rol del usuario
    const role = this.authService.getRoleFromToken();
    // Comprobar el rol del usuario
    this.isAdmin = role === 'Administrador';
    this.isOperador = role === 'Operador';
    this.isGestor = role === 'Gestor';
    this.isAdminOrGestor = this.isAdmin || this.isGestor;
  }
}
