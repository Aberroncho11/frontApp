import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/users.service';
import { UserCreacionDTO } from '../../../interfaces/user/userCreacionDTO.interface';

@Component({
  selector: 'crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent {

  public usuarioForm: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      idProfile: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nickname: ['', [Validators.required]]
    });
  }

  get currentUser(): UserCreacionDTO {
    return this.usuarioForm.value as UserCreacionDTO;
  }

  crearUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.userService.addUser(this.currentUser)
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
