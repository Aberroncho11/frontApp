import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  private router = inject (Router);

  public Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  public myForm : FormGroup = this.fb.group({
    email: ['garhhhiel@gmail.com', [Validators.required, Validators.email]],
    password: ['Aberroncho11', [Validators.required]]
  });

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  login(){

    const {email, password} = this.myForm.value;

    this.authService.login(email, password)
      .subscribe({
        next: () => {
          this.Toast.fire({
            icon: 'success',
            title: 'Loguedo correctamente'
          });
          this.router.navigateByUrl('/store');
        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      })
  }

  register(){
    this.router.navigateByUrl('/auth/register');
  }

}
