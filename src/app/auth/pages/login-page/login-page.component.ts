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

  // Injectamos el router
  private router = inject (Router);

  // Injectamos un SweetAlert para mostrar mensajes
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

  loginForm : FormGroup;

  // Constructor
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private usuarioServicio: UsuarioServicio,
    ) {
      // Creamos un FormGroup con los campos del formulario
      this.loginForm = this.fb.group({
        // Definimos los campos del formulario con sus respectivas validaciones
        email: ['', [Validators.required, Validators.email], [CustomValidators.emailNotExistsValidator(this.usuarioServicio)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)], [CustomValidators.passwordValidator]]
      });
    }

    ngOnInit(): void {
      this.loginForm.get('email')?.valueChanges
        .pipe(
          debounceTime(1000),
          distinctUntilChanged(),
        )
        .subscribe();
    }


  /**
   * Método para loguear un usuario
   * @returns void
   * @memberof LoginPageComponent
   */
  login(){

    // Extraemos los valores del formulario
    const {email, password} = this.loginForm.value;

    // Llamamos al servicio de autenticación para loguear el usuario
    this.authService.login(email, password)
      .subscribe({
        next: () => {
          this.Toast.fire({
            icon: 'success',
            title: 'Loguedo correctamente'
          });
          // Redirigimos a la página de la tienda
          this.router.navigateByUrl('/store');
        },
        // Si hay un error, mostramos un mensaje de error
        error: (message) => {
          Swal.fire('Login incorrecto, la contraseña no pertecene a ese email', message, 'error')
        }
      })
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
      }
    }

    if (field === 'email' && errors['emailExists'] == null) {
      return `Este email no existe`;
    }
    if (field === 'password' && errors['invalidPassword']) {
      return `La contraseña debe contener al menos una letra mayúscula, una minúscula y un número`;
    }

    return null;
  }

}
