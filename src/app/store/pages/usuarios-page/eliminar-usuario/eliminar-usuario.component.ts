import { Component, OnInit, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuarioServicio } from '../../../services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../validators/validadores';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UsuarioDTO } from '../../../interfaces/usuario/usuarioDTO.interface';

@Component({
  selector: 'eliminar-usuario',
  templateUrl: './eliminar-usuario.component.html',
  styleUrls: ['./eliminar-usuario.component.css']
})
export class EliminarUsuarioComponent implements OnInit{

  public usuario: UsuarioDTO | null = null;

  public mostrarTabla: boolean = false;

  public usuarioForm!: FormGroup;

  public usuarioCargado: boolean = false;

  private usuarioServicio = inject(UsuarioServicio);

  private fb = inject(FormBuilder);

  public usuariosLista: UsuarioDTO[] = [];

  public isLoading = true;

  // Inicializador
  ngOnInit() {

    this.usuarioForm = this.fb.group({
      nickname: ['', [ Validators.required ]],
    });

    this.usuarioForm.get('nickname')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();

    setTimeout(() => {
      document.querySelector('.loading-overlay')?.classList.add('hidden');
      }, 500);

    this.usuarioServicio.getNicknameFromToken().subscribe({
      next: (nicknameFromToken) => {
        if (nicknameFromToken) {
          this.usuarioServicio.getUsuarios().subscribe({
            next: (usuarios: UsuarioDTO[]) => {
              usuarios.forEach(usuario => {
                console.log(nicknameFromToken);
                if (usuario.nickname !== nicknameFromToken && usuario.estadoUsuario != 'Eliminado') {
                  this.usuariosLista.push(usuario);
                }
              });
            },
            error: (error) => {
              console.error('Error al obtener los usuarios:', error);
            }
          });
        } else {
          console.error('No se pudo obtener el nickname del token.');
        }
      },
      error: (error) => {
        console.error('Error al obtener el nickname del token:', error);
      }
    });

  }

  /**
   * Método para ver un usuario por id
   * @returns void
   * @memberof EliminarUsuarioComponent
   */
  verUsuariosPorNickname(): void {
    const nickname = this.usuarioForm.get('nickname')?.value;
    if (nickname) {
      this.usuarioServicio.getUsuarioPorNickname(nickname).subscribe(
        usuario => {
          this.usuario = usuario;
          this.mostrarTabla = true;
          this.usuarioCargado = true;
        },
        error => {
          console.error('Error al obtener los usuarios:', error);
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
    const nickname = this.usuarioForm.get('nickname')?.value;
    if (nickname) {
      this.usuarioServicio.deleteUsuario(nickname).subscribe(
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

          this.usuarioForm.get('nickname')?.setValue('');

        },
        error => {
          console.error('Error al eliminar el usuario:', error);
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

    if(!this.usuarioForm?.get(field)) return null;

    const errors = this.usuarioForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch(key) {
        case 'required':
          return 'Este campo es requerido';
      }
    }

    return null;
  }

}
