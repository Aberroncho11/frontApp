import { Component, OnInit, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'inicio-page',
  templateUrl: './inicio-page.component.html',
  styleUrls: ['./inicio-page.component.css']

})
export class InicioPageComponent implements OnInit{

  private authService = inject(AuthService)

  public user = computed(() => this.authService.currentUser() );

  public isAdmin: boolean = false;

  public isOperador: boolean = false;

  public isGestor: boolean = false;

  public isAdminOrGestor: boolean = false;

  public isLoading = true;

  ngOnInit() {
    this.checkRole();

    setTimeout(() => {
    document.querySelector('.loading-overlay')?.classList.add('hidden');
    }, 500);

  }

  /**
   * Método para comprobar el rol del usuario
   * @returns void
   * @memberof InicioPageComponent
   */
  private checkRole(): void{

    const role = this.authService.getRoleFromToken();

    this.isAdmin = role === 'Administrador';

    this.isOperador = role === 'Operador';

    this.isGestor = role === 'Gestor';

    this.isAdminOrGestor = this.isAdmin || this.isGestor;
  }
}
