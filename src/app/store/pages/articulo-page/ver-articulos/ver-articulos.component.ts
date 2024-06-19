import { Component, OnInit, inject } from '@angular/core';
import { ArticuloServicio } from '../../../services/articulo.service';
import { ArticuloAlmacenDTO } from '../../../interfaces/articulo/articuloAlmacenDTO.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'ver-articulos',
  templateUrl: './ver-articulos.component.html',
  styleUrls: ['./ver-articulos.component.css'],
})
export class VerArticulosComponent implements OnInit{

  public articulos: ArticuloAlmacenDTO[] = [];

  public mostrarTabla: boolean = false;

  private articuloServicio = inject(ArticuloServicio);

  public pageSize = 9;

  public totalItems = 0;

  public currentPage = 0;

  public isLoading = true;

  ngOnInit() {
    setTimeout(() => {
      document.querySelector('.loading-overlay')?.classList.add('hidden');
      }, 500);
  }

  // Getters
  get paginatedArticulos(): ArticuloAlmacenDTO[] {

    const startIndex = this.currentPage * this.pageSize;

    const endIndex = startIndex + this.pageSize;

    return this.articulos.slice(startIndex, endIndex);
  }

  /**
   * Muestra los artículos
   * @memberof VerArticulosComponent
   */
  verArticulos(): void {
    this.articuloServicio.getArticulos()
      .subscribe({
        next: (articulos: ArticuloAlmacenDTO[]) => {
          this.articulos = articulos;
          this.totalItems = articulos.length;
          this.mostrarTabla = true;
        },
        error: (error) => {
          console.error('Error al obtener los artículos:', error);
          let errorMsg = error.error.message;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMsg
          });
        }
      });
  }


  /**
   * Oculta la tabla de artículos
   * @memberof VerArticulosComponent
   */
  ocultarTabla(): void {

    this.mostrarTabla = false;

    this.currentPage = 0;
  }

  /**
   * Cambia la página de la tabla de artículos
   * @param event
   * @memberof VerArticulosComponent
   */
  onPageChange(event: any): void {

    this.currentPage = event.pageIndex;
  }


}
