import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuarioGetPorIdDTO } from '../../../interfaces/usuario/usuarioGetPorIdDTO.interface';
import { UsuarioServicio } from '../../../services/usuario.service';
import { UsuarioDTO } from '../../../interfaces/usuario/usuarioDTO.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../validators/validadores';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'eliminar-usuario',
  templateUrl: './eliminar-usuario.component.html',
  styleUrls: ['./eliminar-usuario.component.css']
})
export class EliminarUsuarioComponent {

  public usuario: UsuarioGetPorIdDTO | null = null;
  public mostrarTabla: boolean = false;
  public usuarioForm: FormGroup;
  public usuarioCargado: boolean = false;


  // CONSTRUCTOR
  constructor(private usuarioServicio: UsuarioServicio, private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      idUsuario: [0, [ Validators.required ], CustomValidators.usuarioExistente(this.usuarioServicio)],
    });

    this.usuarioForm.get('idArticulo')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();
  }

  // VER ARTÍCULO POR ID
  verUsuarioPorId(): void {
    const idUsuario = this.usuarioForm.get('idUsuario')?.value;
    if (idUsuario) {
      this.usuarioServicio.getUsuarioPorId(idUsuario).subscribe(
        usuario => {
          this.usuario = usuario;
          this.mostrarTabla = true;
        },
        error => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Usuario no encontrado",
            showConfirmButton: false,
            timer: 1500
          });
          this.mostrarTabla = false;
        }
      );
    }
  }

  // ELIMINAR ARTÍCULO
  eliminarUsuario(): void {
    const idUsuario = this.usuarioForm.get('idUsuario')?.value;
    if (idUsuario) {
      this.usuarioServicio.deleteUsuario(idUsuario).subscribe(
        response => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Usuario eliminado correctamente",
            showConfirmButton: false,
            timer: 1500
          });
          this.usuarioForm.reset();
          this.usuario = null;
          this.mostrarTabla = false;
        },
        error => {
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

  // VERIFICAR CAMPO VÁLIDO
  isValidFieldUsuarioForm( field: string): boolean | null{

    return this.usuarioForm.controls[field].errors
    && this.usuarioForm.controls[field].touched
  }

  // OBTENER ERROR DEL CAMPO
  getFieldErrorUsuarioForm(field: string): string | null{

    const control = this.usuarioForm?.get(field);
    if (!control) return null;

    const errors = control.errors || {};

    if (field === 'idUsuario' && errors['usuarioNotFound']) {
      return `No existe ningún usuario con ese id`;
    }

    return null;
  }

}
