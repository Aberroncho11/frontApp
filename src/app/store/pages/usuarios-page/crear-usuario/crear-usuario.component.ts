import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioServicio } from '../../../services/usuario.service';
import { UsuarioPostDTO } from '../../../interfaces/usuario/usuarioPostDTO.interface';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CustomValidators } from '../../../../validators/validadores';

@Component({
  selector: 'crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent {

  // Formulario de Usuario
  public usuarioForm: FormGroup;

  // Constructor
  constructor(private usuarioServicio: UsuarioServicio, private fb: FormBuilder) {
    // Inicializar el formulario
    this.usuarioForm = this.fb.group({
      perfil: ['', [Validators.required, Validators.pattern('^[1-3]$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)], [CustomValidators.passwordValidator]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)], [CustomValidators.emailExistsValidator(this.usuarioServicio)]],
      nickname: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)], [CustomValidators.nicknameExistsValidator(this.usuarioServicio)]]
    });

    this.usuarioForm.get('perfil')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();

    this.usuarioForm.get('email')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();

    this.usuarioForm.get('nickname')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();

    this.usuarioForm.get('password')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();
  }

  // Getter para obtener los valores del formulario
  get currentUsuario(): UsuarioPostDTO {
    return this.usuarioForm.value as UsuarioPostDTO;
  }

  /**
   * Método para crear un usuario
   * @returns void
   * @memberof CrearUsuarioComponent
   */
  crearUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    // Añadimos el usuario
    this.usuarioServicio.addUsuario(this.currentUsuario)
      .subscribe(
        () => {
          // Mostramos un mensaje de éxito
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Usuario correctamente creado",
            showConfirmButton: false,
            timer: 1500
          });

          // Reseteamos el formulario
          this.usuarioForm.reset();

          this.usuarioForm.reset({
            idProfile: 0
          });

        },
        // En caso de error
        error => {
          console.error('Error al crear usuario:', error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error al crear el usuario",
          });
        }
      );
  }

  /**
   * Método para comprobar si un campo es válido
   * @param field
   * @returns boolean | null
   * @memberof CrearUsuarioComponent
   */
  isValidField(field: string): boolean | null {
    // Comprobamos si el campo ha sido tocado y si tiene errores
    return this.usuarioForm.controls[field].errors &&
    this.usuarioForm.controls[field].touched;
  }

  /**
   *
   * @param field
   * @returns
   */
  getFieldError(field: string): string | null {
    if (!this.usuarioForm.controls[field]) return null;
    const errors = this.usuarioForm.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'maxlength':
          return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
        case 'pattern':
          return 'El perfil tiene que ser un número entre 1 y 3';
      }
    }
    if (field === 'nickname' && errors['nicknameExists']) {
      return `Este nickname ya existe`;
    }
    if (field === 'email' && errors['emailExists']) {
      return `Este email ya existe`;
    }
    if (field === 'password' && errors['invalidPassword']) {
      return `La contraseña debe contener al menos una letra mayúscula, una minúscula y un número`;
    }

    return null;
  }
}
