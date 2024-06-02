import { Component } from '@angular/core';
import { UsuarioServicio } from '../../../services/usuario.service';
import { UsuarioDTO } from '../../../interfaces/usuario/usuarioDTO.interface';

@Component({
  selector: 'ver-usuarios',
  templateUrl: './ver-usuarios.component.html',
  styleUrls: ['./ver-usuarios.component.css']
})
export class VerUsuariosComponent {

  public usuarios: UsuarioDTO[] = [];
  public mostrarTabla: boolean = false;

  constructor(private usuarioServicio: UsuarioServicio) { }

  verUsuarios(): void {

    this.usuarioServicio.getUsuarios().subscribe(
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
