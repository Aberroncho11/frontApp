import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioServicio } from '../../../services/usuario.service';
import { UsuarioPostDTO } from '../../../interfaces/usuario/usuarioPostDTO.interface';
import { CustomValidators } from '../../../../validators/validadores';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {

  public usuarioForm!: FormGroup;

  private usuarioServicio = inject(UsuarioServicio);

  private fb = inject(FormBuilder);

  // Inicializador
  ngOnInit()
  {
    this.usuarioForm = this.fb.group({
      perfil: ['', [Validators.required]],
      password: ['', [Validators.required, CustomValidators.passwordValidator, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        CustomValidators.emailExistsValidator(this.usuarioServicio), Validators.maxLength(30)]],
      nickname: ['', [Validators.required, CustomValidators.nicknameExistsValidator(this.usuarioServicio)], Validators.minLength(4), Validators.maxLength(20)],
    });

    const campos = ['perfil', 'password', 'email', 'nickname'];

    campos.forEach(campo => {

      this.usuarioForm.get(campo)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe();

    });
  }

  // Getter
  get currentUsuario(): UsuarioPostDTO {
    return this.usuarioForm.value as UsuarioPostDTO;
  }

  /**
   * Método para crear un usuario
   * @memberof CrearUsuarioComponent
   */
  crearUsuario(){
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.usuarioServicio.addUsuario(this.currentUsuario)
      .subscribe(
        () => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Usuario correctamente creado",
            showConfirmButton: false,
            timer: 1500
          });

          this.usuarioForm.reset();

          this.usuarioForm.reset({
            idProfile: 0
          });

        },
        error => {
          console.error('Error al crear usuario:', error);
          Swal.fire({
            icon: "error",
            title: "Error",
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
    return this.usuarioForm.controls[field].errors &&
    this.usuarioForm.controls[field].touched;
  }

  /**
   *
   * @param field
   * @returns string | null
   * @memberof CrearUsuarioComponent
   */
  getFieldError(field: string): string | null {

    const control = this.usuarioForm.get(field);

    if (!control) return null;

    const errors = control.errors || {};

    for (const errorName of Object.keys(errors)) {
      switch (errorName) {
        case 'required':
          return 'Este campo es requerido';
        case 'minLength':
          return `Este campo debe tener al menos ${errors['minLength'].requiredLength} caracteres`;
        case 'maxLength':
          return `Este campo debe tener máximo ${errors['maxLength'].requiredLength} caracteres`;
        case 'pattern':
          const patternError = control.getError('pattern');
          const pattern = patternError?.requiredPattern;
          switch (pattern) {
            case /^[1-3]$/:
              return 'El perfil debe ser 1, 2 o 3';
            case /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/:
              return 'Correo electrónico inválido';
            default:
              return 'El valor ingresado no es válido';
          }
        case 'invalidPassword':
          return 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número';
        case 'emailExists':
          return 'El correo electrónico ya está en uso';
        case 'nicknameExists':
          return 'El nickname ya está en uso';
        default:
          return 'Error de validación';
      }
    }
    return null;
  }
}
