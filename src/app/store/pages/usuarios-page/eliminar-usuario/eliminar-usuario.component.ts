import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuarioGetPorIdDTO } from '../../../interfaces/usuario/usuarioGetPorIdDTO.interface';
import { UsuarioServicio } from '../../../services/usuario.service';
import { UsuarioDTO } from '../../../interfaces/usuario/usuarioDTO.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../validators/validadores';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'eliminar-usuario',
  templateUrl: './eliminar-usuario.component.html',
  styleUrls: ['./eliminar-usuario.component.css']
})
export class EliminarUsuarioComponent {

  // Usuario
  public usuario: UsuarioGetPorIdDTO | null = null;

  // Mostrar tabla
  public mostrarTabla: boolean = false;

  // Formulario de Usuario
  public usuarioForm: FormGroup;

  // Usuario cargado
  public usuarioCargado: boolean = false;

  // Constructor
  constructor(private usuarioServicio: UsuarioServicio, private fb: FormBuilder) {
    // Inicializar el formulario
    this.usuarioForm = this.fb.group({
      idUsuario: [0, [ Validators.required ], CustomValidators.usuarioExistente(this.usuarioServicio)],
    });

    // Suscribirse a los cambios del campo idUsuario
    this.usuarioForm.get('idArticulo')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();
  }

  /**
   * Método para ver un usuario por id
   * @returns void
   * @memberof EliminarUsuarioComponent
   */
  verUsuarioPorId(): void {
    // Obtener el id del usuario
    const idUsuario = this.usuarioForm.get('idUsuario')?.value;
    // Si existe el id del usuario
    if (idUsuario) {
      // Obtener el usuario por id
      this.usuarioServicio.getUsuarioPorId(idUsuario).subscribe(
        usuario => {
          this.usuario = usuario;
          this.mostrarTabla = true;
          this.usuarioCargado = true;
        },
        // Manejo de errores
        error => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Usuario no encontrado",
            showConfirmButton: false,
            timer: 1500
          });
        }
      );
    }
  }

  /**
   * Método para eliminar un usuario
   * @returns void
   * @memberof EliminarUsuarioComponent
   */
  eliminarUsuario(): void {
    // Obtener el id del usuario
    const idUsuario = this.usuarioForm.get('idUsuario')?.value;
    // Si existe el id del usuario
    if (idUsuario) {
      // Eliminar el usuario
      this.usuarioServicio.deleteUsuario(idUsuario).subscribe(
        response => {
          // Mostrar mensaje de éxito
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Usuario eliminado correctamente",
            showConfirmButton: false,
            timer: 1500
          });

          // Reiniciar las variables
          this.usuarioForm.reset();

          // Reiniciar el usuario
          this.usuario = null;

          // Reiniciar la tabla
          this.mostrarTabla = false;

        },
        error => {
          // Mostrar mensaje de error
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error al eliminar usuario",
            showConfirmButton: false,
            timer: 1500
          });
        }
      );
    }
  }

  /**
   * Método para comprobar si un campo es válido
   * @param field
   * @returns
   * @memberof EliminarUsuarioComponent
   */
  isValidFieldUsuarioForm( field: string): boolean | null{
    // Comprobar si el campo es inválido
    return this.usuarioForm.controls[field].errors
    && this.usuarioForm.controls[field].touched
  }

  /**
   * Método para obtener el error del campo
   * @param field
   * @returns
   * @memberof EliminarUsuarioComponent
   */
  getFieldErrorUsuarioForm(field: string): string | null{

    // Si el campo no existe
    const control = this.usuarioForm?.get(field);

    // Si no hay control
    if (!control) return null;

    // Obtener los errores
    const errors = control.errors || {};

    // Si el field es idUsuario y hay un error de usuarioNotFound
    if (field === 'idUsuario' && errors['usuarioNotFound']) {
      return `No existe ningún usuario con ese id`;
    }

    return null;
  }

}
