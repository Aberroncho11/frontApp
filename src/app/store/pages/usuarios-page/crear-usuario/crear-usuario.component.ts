import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioServicio } from '../../../services/usuario.service';
import { UsuarioPostDTO } from '../../../interfaces/usuario/usuarioPostDTO.interface';

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
      perfil: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required]],
      nickname: ['', [Validators.required]]
    });
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
    // Comprobamos si el campo tiene errores
    const control = this.usuarioForm.get(field);
    // Si no hay control
    if (!control) return null;
    // Obtenemos los errores
    const errors = control.errors || {};
    // Recorremos los errores
    for (const key of Object.keys(errors)) {
      switch (key) {
        // Comprobamos el tipo de error
        case 'required':
          return 'Este campo es requerido';
        case 'email':
          return 'Correo electrónico inválido';
      }
    }
    return null;
  }
}
