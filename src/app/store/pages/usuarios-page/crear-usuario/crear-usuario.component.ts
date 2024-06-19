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

  public isLoading = true;

  // Inicializador
  ngOnInit()
  {
    this.usuarioForm = this.fb.group({
      perfil: ['', [Validators.required]],
      password: ['', [Validators.required, CustomValidators.passwordValidator, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), Validators.maxLength(30), ], [CustomValidators.emailExistsValidator(this.usuarioServicio)]],
      nickname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20), Validators.pattern(/^(?!.* {2,}).*$/)], [CustomValidators.nicknameExistsValidator(this.usuarioServicio)]],
    });

    setTimeout(() => {
      document.querySelector('.loading-overlay')?.classList.add('hidden');
      }, 500);

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

    this.usuarioServicio.addUsuario(this.currentUsuario).subscribe({
      next: () => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Usuario correctamente creado",
          showConfirmButton: false,
          timer: 1500
        });

        this.usuarioForm.reset();
        this.usuarioForm.get('perfil')?.setValue('');

      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al crear el usuario",
        });
      }
    });
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

    if (!this.usuarioForm.controls[field]) return null;

    const errors = this.usuarioForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `La longitud mínima deber ser de ${errors['minlength'].requiredLength} caracteres`;
        case 'maxlength':
          return `La longitud máxima debe ser de ${errors['maxlength'].requiredLength} caracteres`;
        case 'invalidPassword':
          return 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número';
        case 'pattern':
          if (field === 'email') {
            return 'Email inválido';
          } else if (field === 'nickname') {
            return 'No se permiten espacios en blanco consecutivos';
          }
      }
    }

    if (field === 'nickname' && errors['nicknameExists']) {
      return 'El nickname ya existe';
    }

    if (field === 'email' && errors['emailExists']) {
      return 'El email ya existe';
    }

    return null;
  }
}
