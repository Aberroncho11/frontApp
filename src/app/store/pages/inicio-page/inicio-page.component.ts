import { Component, computed } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'inicio-page',
  templateUrl: './inicio-page.component.html',
  styleUrls: ['./inicio-page.component.css']

})
export class InicioPageComponent {

  public isLoading = true;

  constructor(private authService: AuthService) {
    this.checkRole();
  }

  public user = computed(() => this.authService.currentUser() );

  public isAdmin: boolean = false;
  public isOperador: boolean = false;
  public isGestor: boolean = false;
  public isAdminOrGestor: boolean = false;

  private checkRole() {
    const role = this.authService.getRoleFromToken();
    this.isAdmin = role === 'Administrador';
    this.isOperador = role === 'Operador';
    this.isGestor = role === 'Gestor';
    this.isAdminOrGestor = this.isAdmin || this.isGestor;
  }
}
