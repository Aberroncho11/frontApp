import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { CustomValidators } from '../../../validators/validadores';
import { UsuarioServicio } from '../../../store/services/usuario.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  // Inyectamos los servicios necesarios
  private router = inject (Router);
  private authService = inject (AuthService);
  private fb = inject (FormBuilder);

  // Creamos el formulario de login
  public loginForm: FormGroup = this.fb.group({

    email: ['', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|es)$/)],
    ],

    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20)
    ]]

  });

  // Creamos un toast para mostrar mensajes
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

  ngOnInit(): void {

    const campos = ['email', 'password'];

    campos.forEach(campo => {

      this.loginForm.get(campo)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe();

    });

  }


    /**
   * Método para loguear un usuario
   * @returns void
   * @memberof LoginPageComponent
   */
  login(){

    const {email, password} = this.loginForm.value;

    this.authService.login(email, password)

    .subscribe({
      next: () => {
        this.Toast.fire({
          icon: 'success',
          title: 'Loguedo correctamente'
        });
        this.router.navigateByUrl('/store');
      },

      error: (errorResponse) => {
        switch (errorResponse) {
          case `No existe un usuario con el email ${email}`:
            Swal.fire('Error de inicio de sesión', errorResponse, 'error');
            break;
          case "Login incorrecto, el email no coincide con la contraseña puesta o la contraseña es incorrecta":
            Swal.fire('Error de inicio de sesión', errorResponse, 'error');
            break;
          case "El usuario con el que se quiere acceder está eliminado":
            Swal.fire('Error de inicio de sesión', errorResponse, 'error');
            break;
          default:
            Swal.fire('Error de inicio de sesión', 'Ha ocurrido un error durante el inicio de sesión', 'error');
        }
      }
    });
  }


  isValidField(field: string): boolean | null {
    return this.loginForm.controls[field].errors &&
      this.loginForm.controls[field].touched;
  }

  getFieldError(field: string): string | null {

    if (!this.loginForm.controls[field]) return null;

    const errors = this.loginForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'maxlength':
          return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
        case 'pattern':
          return `El email no cumple el formato`;
      }
    }

    // if (field === 'email' && errors['emailExists'] == null) {
    //   return `Este email no existe`;
    // }

    return null;
  }

}
