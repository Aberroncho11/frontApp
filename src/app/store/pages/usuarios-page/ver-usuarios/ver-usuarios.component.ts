import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UsuarioDTO } from '../../../interfaces/usuario/usuarioDTO.interface';
import { UsuarioServicio } from '../../../services/usuario.service';

@Component({
  selector: 'ver-usuarios',
  templateUrl: './ver-usuarios.component.html',
  styleUrls: ['./ver-usuarios.component.css']
})
export class VerUsuariosComponent {

  public dataSource = new MatTableDataSource<UsuarioDTO>([]);
  public mostrarTabla: boolean = false;
  public displayedColumns: string[] = ['idUsuario', 'perfil', 'password', 'email', 'estadoUsuario', 'nickname'];
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public pageSize = 10;
  public totalItems = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private usuarioServicio: UsuarioServicio) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  verUsuarios(): void {
    this.usuarioServicio.getUsuarios()
      .subscribe(
        (pedidos: UsuarioDTO[]) => {
          this.dataSource.data = pedidos;
          this.totalItems = pedidos.length;
          console.log(this.dataSource.paginator);
          this.mostrarTabla = true;
        },
        (error) => {
          console.error('Error al obtener los usuarios:', error);
        }
      );
  }

  ocultarTabla(): void {
    this.mostrarTabla = false;
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
  }

}
