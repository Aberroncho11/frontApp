import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']

})
export class LandingPageComponent{

  private authService = inject( AuthService );

  public user = computed(() => this.authService.currentUser() );

  onLogout() {
    this.authService.logout();
  }
}
