import { Component } from '@angular/core';
import { UserService } from '../../../services/users.service';
import { UserDTO } from '../../../interfaces/user/userDTO.interface';

@Component({
  selector: 'ver-usuarios',
  templateUrl: './ver-usuarios.component.html',
  styleUrls: ['./ver-usuarios.component.css']
})
export class VerUsuariosComponent {

  public usuarios: UserDTO[] = [];
  public mostrarTabla: boolean = false;

  constructor(private usersService: UserService) { }

  verUsuarios(): void {

    this.usersService.getUsers().subscribe(
      usuarios => {
        this.usuarios = usuarios;
        this.mostrarTabla = true;
      }
    );
  }

  ocultarTabla(): void {

    this.mostrarTabla = false;
  }

}
