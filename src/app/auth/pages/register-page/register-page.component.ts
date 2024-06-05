import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject (Router);

  public registerForm : FormGroup = this.fb.group({
    perfil: ['fernando@google.com', [Validators.required, Validators.email]],
    nickname: ['123456', [Validators.required, Validators.minLength(6)]],
    email: ['fernando@google.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]]
  });

  register(){
    const {email, password} = this.registerForm.value;

    this.authService.login(email, password)
      .subscribe({
        next: () => this.router.navigateByUrl('/auth/login'),
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      })
  }

  goLogin(){
    this.router.navigateByUrl('/auth/login');
  }

}
