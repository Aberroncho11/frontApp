import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioPostDTO } from '../../../interfaces/usuario/usuarioPostDTO.interface';
import { UsuarioServicio } from '../../../services/usuario.service';
import { UsuarioGetPorIdDTO } from '../../../interfaces/usuario/usuarioGetPorIdDTO.interface';
import { CustomValidators } from '../../../validators/validadores';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UsuarioPutDTO } from '../../../interfaces/usuario/usuarioPutDTO.interface';

@Component({
  selector: 'modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css']
})
export class ModificarUsuarioComponent {

  public usuarioForm: FormGroup;

  public usuarioIdForm: FormGroup;

  public usuario: UsuarioGetPorIdDTO | null = null;

  public idUsuario: number = 0;

  // CONSTRUCTOR
  constructor(private usuarioServicio: UsuarioServicio, private fb: FormBuilder) {

    this.usuarioForm = this.fb.group({
      perfil: [0, [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required]],
      estadoUsuario: ['', [Validators.required]],
      nickname: ['', [Validators.required]]
    });

    this.usuarioIdForm = this.fb.group({
      idUsuario: [0, [ Validators.required ], CustomValidators.usuarioExistente(this.usuarioServicio)],
    });

    this.usuarioIdForm.get('idUsuario')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();
  }

  // COGER USUARIO DEL FORM
  get currentUsuario(): UsuarioPutDTO {

    const usuario = this.usuarioForm.value as UsuarioPutDTO;
    return usuario;
  }

  // VER USUARIO POR ID
  verUsuariosPorId(): void {
    this.usuarioServicio.getUsuarioPorId(this.idUsuario)
    .subscribe(usuario => {
      console.log({usuario});
      this.usuario = usuario;
      this.usuarioForm.patchValue({
        perfil: usuario.perfil,
        password: usuario.password,
        email: usuario.email,
        estadoUsuario: usuario.estadoUsuario,
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

    this.usuarioServicio.updateUsuario(this.currentUsuario, this.idUsuario)
    .subscribe(response => {
      console.log(this.currentUsuario);
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

  // VERIFICAR CAMPO VÁLIDO
  isValidFieldUsuarioIdForm( field: string): boolean | null{

    return this.usuarioIdForm.controls[field].errors
    && this.usuarioIdForm.controls[field].touched
  }

  // OBTENER ERROR DEL CAMPO
  getFieldErrorUsuarioIdForm(field: string): string | null{

    const control = this.usuarioIdForm?.get(field);
    if (!control) return null;

    const errors = control.errors || {};

    if (field === 'idUsuario' && errors['usuarioNotFound']) {
      return `No existe ningún usuario con ese id`;
    }

    return null;
  }

}
