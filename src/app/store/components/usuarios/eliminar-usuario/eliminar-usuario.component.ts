import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { UserGetPorIdDTO } from '../../../interfaces/user/usuarioGetPorIdDTO.interface';
import { UserService } from '../../../services/users.service';

@Component({
  selector: 'eliminar-usuario',
  templateUrl: './eliminar-usuario.component.html',
  styleUrls: ['./eliminar-usuario.component.css']
})
export class EliminarUsuarioComponent {

  public usuario: UserGetPorIdDTO | null = null;
  public mostrarTabla: boolean = false;
  public idUsuario: number = 0;

  // CONSTRUCTOR
  constructor(private userService: UserService) {}

  // VER ARTÍCULO POR ID
  verUsuariosPorId(): void {
    this.userService.getUserPorId(this.idUsuario).subscribe(
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

  // ELIMINAR ARTÍCULO
  eliminarUsuario(): void {
    this.userService.deleteUser(this.idUsuario).subscribe(
      response => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Usuario eliminado correctamente",
          showConfirmButton: false,
          timer: 1500
        });
        this.idUsuario = 0;
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
