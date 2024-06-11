import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioServicio } from '../../../services/usuario.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UsuarioPutDTO } from '../../../interfaces/usuario/usuarioPutDTO.interface';
import { UsuarioDTO } from '../../../interfaces/usuario/usuarioDTO.interface';

@Component({
  selector: 'modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css']
})

export class ModificarUsuarioComponent implements OnInit {

  public usuarioForm!: FormGroup;

  public usuarioIdForm!: FormGroup;

  public usuario: UsuarioDTO | null = null;

  public usuariosLista: UsuarioDTO[] = [];

  public mostrarTabla: boolean = false;

  private usuarioServicio = inject(UsuarioServicio);

  private fb = inject(FormBuilder);

  ngOnInit() {

    this.usuarioForm = this.fb.group({
      perfil: [0, [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required]],
      estadoUsuario: ['', [Validators.required]],
      nickname: ['', [Validators.required]]
    });

    this.usuarioIdForm = this.fb.group({
      nickname: ['', [ Validators.required ]],
    });

    this.usuarioIdForm.get('nickname')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();

    this.usuarioServicio.getUsuarios()
    .subscribe({
      next: (usuarios: UsuarioDTO[]) => {
        this.usuariosLista = usuarios;
      },
      error: (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    });

  }

  /**
   * Método para ver un usuario por id
   * @returns void
   * @memberof ModificarUsuarioComponent
   */
  get currentUsuario(): UsuarioPutDTO {

    const usuario = this.usuarioForm.value as UsuarioPutDTO;
    return usuario;
  }

  /**
 * Método para ver un usuario por id
 * @returns void
 * @memberof ModificarUsuarioComponent
 */
  verUsuariosPorNickname(): void {
    this.usuarioServicio.getUsuarioPorNickname(this.usuarioIdForm.get('nickname')?.value)
      .subscribe({
        next: usuario => {
          this.usuario = usuario;

          this.usuarioForm.patchValue({
            perfil: usuario.perfil,
            password: usuario.password,
            email: usuario.email,
            estadoUsuario: usuario.estadoUsuario,
            nickname: usuario.nickname,
          });

          this.mostrarTabla = true;
        },
        error: error => {
          console.error('Error al obtener el usuario:', error);
        }
      });
  }

  /**
   * Método para modificar un usuario
   * @returns void
   * @memberof ModificarUsuarioComponent
   */
  modificarUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.usuarioServicio.updateUsuario(this.currentUsuario, this.usuarioIdForm.get('nickname')?.value)
      .subscribe({
        next: response => {
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

          this.mostrarTabla = false;
        },
        error: error => {
          console.error('Error al modificar usuario:', error);
        }
      });
  }


  /**
   * Método para obtener el id del usuario
   * @param field
   * @returns boolean | null
   * @memberof ModificarUsuarioComponent
   */
  isValidField( field: string): boolean | null{
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

  /**
   * Método para obtener el id del usuario
   * @param field
   * @returns boolean | null
   * @memberof ModificarUsuarioComponent
   */
  isValidFieldUsuarioIdForm( field: string): boolean | null{
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

     if(!this.usuarioIdForm.controls[field]) return null;

     const errors = this.usuarioIdForm.controls[field].errors || {};

    if (field === 'idUsuario' && errors['usuarioNotFound']) {
      return `No existe ningún usuario con ese id`;
    }

    return null;
  }

}
