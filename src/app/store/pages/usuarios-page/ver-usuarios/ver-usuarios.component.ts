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

   // Array de artículos
   public usuarios: UsuarioDTO[] = [];

   // Variable para mostrar la tabla
   public mostrarTabla: boolean = false;

   // Variables para la paginación
   // Variable para el tamaño de la página
   public pageSize = 9;
   // Variable para el total de artículos
   public totalItems = 0;
   // Variable para la página actual
   public currentPage = 0;

   constructor(private usuarioServicio: UsuarioServicio) {}

   // Metodo para obtener los artículos
   verUsuarios(): void {
     this.usuarioServicio.getUsuarios()
       .subscribe(
         (usuarios: UsuarioDTO[]) => {
           // Asignar los artículos obtenidos
           this.usuarios = usuarios;
           // Asignar el total de artículos
           this.totalItems = usuarios.length;
           // Mostrar la tabla
           this.mostrarTabla = true;
         },
         // Manejo de errores
         (error) => {
           console.error('Error al obtener los pedidos:', error);
         }
       );
   }

   // Metodo para ocultar la tabla
   ocultarTabla(): void {
     // Ocultar la tabla
     this.mostrarTabla = false;
   }

   // Metodo para cambiar de página
   onPageChange(event: any): void {
     // Actualizar la página actual
     this.currentPage = event.pageIndex;
   }

   // Metodo para obtener los artículos paginados
   get paginatedUsuarios(): UsuarioDTO[] {
     // Calcular el índice de inicio y fin
     const startIndex = this.currentPage * this.pageSize;
     const endIndex = startIndex + this.pageSize;
     // Retornar los artículos paginados
     return this.usuarios.slice(startIndex, endIndex);
   }
}
