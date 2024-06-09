import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
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

  public mostrarUsuario = false;

  // Constructor
  constructor(private usuarioServicio: UsuarioServicio, private fb: FormBuilder) {

    // Inicializar el formulario
    this.usuarioForm = this.fb.group({
      perfil: ['', [Validators.required, Validators.pattern('^[1-3]$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)], [CustomValidators.passwordValidator]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]],
      estadoUsuario: ['', [Validators.required, Validators.pattern('^(Disponible|Eliminado)$')]],
      nickname: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });

    // Inicializar el formulario de usuario por id
    this.usuarioIdForm = this.fb.group({
      idUsuario: ['', [ Validators.required ], CustomValidators.usuarioExistente(this.usuarioServicio)],
    });

    // Suscribirse a los cambios del campo idUsuario
    this.usuarioIdForm.get('idUsuario')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();

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

    this.usuarioForm.get('estadoUsuario')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();
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
    this.usuarioServicio.getUsuarioPorId(this.usuarioIdForm.get('idUsuario')?.value)
    .subscribe(usuario => {

      // Asignar el usuario
      this.usuario = usuario;

      this.mostrarUsuario = true;

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
    this.usuarioServicio.updateUsuario(this.currentUsuario, this.usuarioIdForm.get('idUsuario')?.value)
    .subscribe(response => {
      // Mostrar mensaje de éxito
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Usuario correctamente editado",
        showConfirmButton: false,
        timer: 1500
      });

      this.usuarioIdForm.reset({
        idUsuario: '',
      });

      this.mostrarUsuario = false;


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
        case 'email':
          return 'El email debe ser válido';
        case 'pattern':
          if (field === 'perfil') {
            return 'El perfil debe ser 1, 2 o 3';
          } else if (field === 'estadoUsuario') {
            return 'El estado debe ser Disponible o Eliminado';
          }
      }
    }
    if (field === 'password' && errors['invalidPassword']) {
      return `La contraseña debe contener al menos una letra mayúscula, una minúscula y un número`;
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
