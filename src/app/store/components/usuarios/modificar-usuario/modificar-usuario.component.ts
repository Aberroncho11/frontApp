import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserCreacionDTO } from '../../../interfaces/user/userCreacionDTO.interface';
import { UserService } from '../../../services/users.service';
import { UserGetPorIdDTO } from '../../../interfaces/user/usuarioGetPorIdDTO.interface';

@Component({
  selector: 'modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css']
})
export class ModificarUsuarioComponent {

  public usuarioForm: FormGroup;

  public usuario: UserGetPorIdDTO | null = null;

  public idUser: number = 0;

  // CONSTRUCTOR
  constructor(private userService: UserService, private fb: FormBuilder) {

    this.usuarioForm = this.fb.group({
      idProfile: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required]],
      nickname: ['', [Validators.required]]
    });
  }

  // COGER USUARIO DEL FORM
  get currentUser(): UserCreacionDTO {

    const usuario = this.usuarioForm.value as UserCreacionDTO;
    return usuario;
  }

  // VER USUARIO POR ID
  verUsuariosPorId(): void {
    this.userService.getUserPorId(this.idUser)
    .subscribe(usuario => {
      console.log({usuario});
      this.usuario = usuario;
      this.usuarioForm.patchValue({
        idProfile: usuario.idProfile,
        password: usuario.password,
        email: usuario.email,
        nickname: usuario.nickname,
      });
    }, error => {
      console.error('Error al obtener el artículo:', error);
    });
  }

  // MODIFICAR USUARIO
  modificarUsuario(): void {

    if(this.usuarioForm.invalid){
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.userService.updateUser(this.currentUser, this.idUser)
    .subscribe(response => {
      console.log(this.currentUser);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Usuario correctamente editado",
        showConfirmButton: false,
        timer: 1500
      });

      this.usuarioForm.reset();

      this.usuarioForm.reset({
        idProfile: 0,
      });

    }, error => {
      console.error('Error al modificar usuario:', error);
    });
  }

  // VERIFICAR CAMPO VÁLIDO
  isValidField( field: string): boolean | null{

    return this.usuarioForm.controls[field].errors
    && this.usuarioForm.controls[field].touched
  }

  // OBTENER ERROR DEL CAMPO
  getFieldError(field: string): string | null{

    if(!this.usuarioForm.controls[field]) return null;

    const errors = this.usuarioForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch(key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
      }
    }

    return null;
  }

}
