import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioServicio } from '../../../services/usuario.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UsuarioPutDTO } from '../../../interfaces/usuario/usuarioPutDTO.interface';
import { UsuarioDTO } from '../../../interfaces/usuario/usuarioDTO.interface';
import { CustomValidators } from '../../../../validators/validadores';

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

  public email: string = '';

  public nickname: string = '';

  public estadoEliminado: boolean = false;

  public isLoading = true;

  // Inicializador
  ngOnInit() {

    this.usuarioForm = this.fb.group({
      perfil: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), Validators.maxLength(30)]],
      estadoUsuario: ['', [Validators.required]],
      nickname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20), Validators.pattern(/^(?!.* {2,}).*$/)]],
    });

    setTimeout(() => {
      document.querySelector('.loading-overlay')?.classList.add('hidden');
      }, 500);

    this.usuarioIdForm = this.fb.group({
      nickname: ['', [ Validators.required ]],
    });

    const campos = ['perfil', 'email', 'nickname'];

    campos.forEach(campo => {

      this.usuarioForm.get(campo)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe();

    });

    this.usuarioIdForm.get('nickname')?.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
    ).subscribe();

    this.usuarioServicio.getNicknameFromToken().subscribe({
      next: (nicknameFromToken) => {
        if (nicknameFromToken) {
          this.usuarioServicio.getUsuarios().subscribe({
            next: (usuarios: UsuarioDTO[]) => {
              usuarios.forEach(usuario => {
                if (usuario.nickname !== nicknameFromToken) {
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

          this.estadoEliminado = false;

          this.usuarioForm.patchValue({
            perfil: usuario.perfil,
            email: usuario.email,
            estadoUsuario: usuario.estadoUsuario,
            nickname: usuario.nickname,
          });

          if(usuario.estadoUsuario == 'Eliminado'){
            this.estadoEliminado = true;
          }

          console.log(this.estadoEliminado);

          this.mostrarTabla = true;

          this.email = usuario.email;

          this.nickname = usuario.nickname;
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

    if(this.usuarioServicio.checkEmail( this.currentUsuario.email) && this.currentUsuario.email != this.email)
    {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Ya existe un usuario con ese email",
        showConfirmButton: false,
        timer: 1500
      });
    }
    else if(this.usuarioServicio.checkNickname( this.currentUsuario.nickname) && this.currentUsuario.nickname != this.nickname)
    {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Ya existe un usuario con ese nickname",
        showConfirmButton: false,
        timer: 1500
      });
    }
    else{
      this.usuarioServicio.updateUsuario(this.currentUsuario, this.usuarioIdForm.get('nickname')?.value)
      .subscribe({
        next: () => {
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
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error al modificar usuario",
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    }
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
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `La longitud mínima deber ser de ${errors['minlength'].requiredLength} caracteres`;
        case 'maxlength':
          return `La longitud máxima debe ser de ${errors['maxlength'].requiredLength} caracteres`;
          case 'pattern':
            if (field === 'email') {
              return 'Email inválido';
            } else if (field === 'nickname') {
              return 'No se permiten espacios en blanco consecutivos';
            }
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

      for (const key of Object.keys(errors)) {
        switch(key) {
          case 'required':
            return 'Este campo es requerido';
        }
      }

    return null;
  }

}
