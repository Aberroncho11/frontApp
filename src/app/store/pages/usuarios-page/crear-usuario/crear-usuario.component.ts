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

  public usuarioForm: FormGroup;

  constructor(private usuarioServicio: UsuarioServicio, private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      perfil: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nickname: ['', [Validators.required]]
    });
  }

  get currentUsuario(): UsuarioPostDTO {
    return this.usuarioForm.value as UsuarioPostDTO;
  }

  crearUsuario(): void {
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
        }
      );
  }

  isValidField(field: string): boolean | null {
    return this.usuarioForm.controls[field].errors && this.usuarioForm.controls[field].touched;
  }

  getFieldError(field: string): string | null {
    const control = this.usuarioForm.get(field);
    if (!control) return null;

    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'email':
          return 'Correo electrónico inválido';
      }
    }
    return null;
  }
}
