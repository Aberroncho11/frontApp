import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioPostDTO } from '../../../interfaces/usuario/usuarioPostDTO.interface';
import { UsuarioServicio } from '../../../services/usuario.service';
import { UsuarioGetPorIdDTO } from '../../../interfaces/usuario/usuarioGetPorIdDTO.interface';
import { CustomValidators } from '../../../../validators/validadores';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UsuarioPutDTO } from '../../../interfaces/usuario/usuarioPutDTO.interface';

@Component({
  selector: 'modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css']
})
export class ModificarUsuarioComponent {

  // Formulario de Usuario
  public usuarioForm: FormGroup;

  // Formulario de Usuario por Id
  public usuarioIdForm: FormGroup;

  // Usuario
  public usuario: UsuarioGetPorIdDTO | null = null;

  // Id del Usuario
  public idUsuario: number = 0;

  // Constructor
  constructor(private usuarioServicio: UsuarioServicio, private fb: FormBuilder) {

    // Inicializar el formulario
    this.usuarioForm = this.fb.group({
      perfil: [0, [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required]],
      estadoUsuario: ['', [Validators.required]],
      nickname: ['', [Validators.required]]
    });

    // Inicializar el formulario de usuario por id
    this.usuarioIdForm = this.fb.group({
      idUsuario: [0, [ Validators.required ], CustomValidators.usuarioExistente(this.usuarioServicio)],
    });

    // Suscribirse a los cambios del campo idUsuario
    this.usuarioIdForm.get('idUsuario')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();
  }

  /**
   * Método para ver un usuario por id
   * @returns void
   * @memberof ModificarUsuarioComponent
   */
  get currentUsuario(): UsuarioPutDTO {

    // Obtener el usuario
    const usuario = this.usuarioForm.value as UsuarioPutDTO;
    return usuario;
  }

  /**
   * Método para ver un usuario por id
   * @returns void
   * @memberof ModificarUsuarioComponent
   */
  verUsuariosPorId(): void {
    // Obtener el id del usuario
    this.usuarioServicio.getUsuarioPorId(this.idUsuario)
    .subscribe(usuario => {

      // Asignar el usuario
      this.usuario = usuario;

      // Asignar los valores al formulario
      this.usuarioForm.patchValue({
        perfil: usuario.perfil,
        password: usuario.password,
        email: usuario.email,
        estadoUsuario: usuario.estadoUsuario,
        nickname: usuario.nickname,
      });

    // Manejo de errores
    }, error => {
      console.error('Error al obtener el artículo:', error);
    });
  }

  /**
   * Método para modificar un usuario
   * @returns void
   * @memberof ModificarUsuarioComponent
   */
  modificarUsuario(): void {

    // Si el formulario es inválido
    if(this.usuarioForm.invalid){
      // Marcar los campos como tocados
      this.usuarioForm.markAllAsTouched();
      return;
    }

    // Modificar el usuario
    this.usuarioServicio.updateUsuario(this.currentUsuario, this.idUsuario)
    .subscribe(response => {
      // Mostrar mensaje de éxito
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Usuario correctamente editado",
        showConfirmButton: false,
        timer: 1500
      });

      // Reiniciar el formulario
      this.usuarioForm.reset();

      // Reiniciar el usuario
      this.usuarioForm.reset({
        idProfile: 0,
      });

    // Manejo de errores
    }, error => {
      console.error('Error al modificar usuario:', error);
    });
  }

  /**
   * Método para obtener el id del usuario
   * @param field
   * @returns boolean | null
   * @memberof ModificarUsuarioComponent
   */
  isValidField( field: string): boolean | null{
    // Comprobar si el campo es inválido
    return this.usuarioForm.controls[field].errors
    && this.usuarioForm.controls[field].touched
  }

  /**
   * Método para obtener el error del campo
   * @param field
   * @returns string | null
   * @memberof ModificarUsuarioComponent
   */
  getFieldError(field: string): string | null{

    // Comprobar si el campo no existe
    if(!this.usuarioForm.controls[field]) return null;

    // Obtener los errores
    const errors = this.usuarioForm.controls[field].errors || {};

    // Recorrer los errores
    for (const key of Object.keys(errors)) {
      switch(key) {
        // Si el campo es requerido
        case 'required':
          return 'Este campo es requerido';
        // Si el campo no cumple la longitud mínima
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
      }
    }

    return null;
  }

  /**
   * Método para obtener el id del usuario
   * @param field
   * @returns boolean | null
   * @memberof ModificarUsuarioComponent
   */
  isValidFieldUsuarioIdForm( field: string): boolean | null{
    // Comprobar si el campo es inválido
    return this.usuarioIdForm.controls[field].errors
    && this.usuarioIdForm.controls[field].touched
  }

  /**
   * Método para obtener el error del campo
   * @param field
   * @returns string | null
   * @memberof ModificarUsuarioComponent
   */
  getFieldErrorUsuarioIdForm(field: string): string | null{

     // Comprobar si el campo no existe
     if(!this.usuarioIdForm.controls[field]) return null;

     // Obtener los errores
     const errors = this.usuarioIdForm.controls[field].errors || {};

    // Recorrer los errores
    if (field === 'idUsuario' && errors['usuarioNotFound']) {
      return `No existe ningún usuario con ese id`;
    }

    return null;
  }

}
