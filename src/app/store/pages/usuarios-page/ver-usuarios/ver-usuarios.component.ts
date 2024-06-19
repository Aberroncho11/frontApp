import { Component, OnInit, inject } from '@angular/core';
import { UsuarioDTO } from '../../../interfaces/usuario/usuarioDTO.interface';
import { UsuarioServicio } from '../../../services/usuario.service';

@Component({
  selector: 'ver-usuarios',
  templateUrl: './ver-usuarios.component.html',
  styleUrls: ['./ver-usuarios.component.css']
})
export class VerUsuariosComponent implements OnInit{

   public usuarios: UsuarioDTO[] = [];

   public mostrarTabla: boolean = false;

   public pageSize = 9;
   public totalItems = 0;
   public currentPage = 0;

   private usuarioServicio = inject(UsuarioServicio);

   public isLoading = true;

   ngOnInit() {
    setTimeout(() => {
      document.querySelector('.loading-overlay')?.classList.add('hidden');
      }, 500);
   }

   /**
    * Método para obtener los usuarios
    * @memberof VerUsuariosComponent
    */
   verUsuarios(): void {
     this.usuarioServicio.getUsuarios()
       .subscribe(
         (usuarios: UsuarioDTO[]) => {
           this.usuarios = usuarios;
           this.totalItems = usuarios.length;
           this.mostrarTabla = true;
         },
         (error) => {
           console.error('Error al obtener los usuarios:', error);
         }
       );
   }

   /**
    * Método para ocultar la tabla
    * @memberof VerUsuariosComponent
    */
   ocultarTabla(): void {

     this.mostrarTabla = false;
   }

   /**
    * Método para cambiar de página
    * @param event
    * @memberof VerUsuariosComponent
    */
   onPageChange(event: any): void {

     this.currentPage = event.pageIndex;
   }

   /**
    * Método para obtener los usuarios paginados
    * @memberof VerUsuariosComponent
    */
   get paginatedUsuarios(): UsuarioDTO[] {

     const startIndex = this.currentPage * this.pageSize;
     const endIndex = startIndex + this.pageSize;
     return this.usuarios.slice(startIndex, endIndex);
   }
}
