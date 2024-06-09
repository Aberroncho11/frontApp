import { Component, inject } from '@angular/core';
import { ArticuloServicio } from '../../../services/articulo.service';
import { ArticuloAlmacenDTO } from '../../../interfaces/articulo/articuloAlmacenDTO.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'ver-articulos',
  templateUrl: './ver-articulos.component.html',
  styleUrls: ['./ver-articulos.component.css'],
})
export class VerArticulosComponent {

  public articulos: ArticuloAlmacenDTO[] = [];

  public mostrarTabla: boolean = false;

  public pageSize = 9;

  public totalItems = 0;

  public currentPage = 0;

  private articuloServicio = inject(ArticuloServicio);

  /**
   * Método que obtiene los artículos del almacén y los muestra con cards
   * @returns void
   * @memberof VerArticulosComponent
   */
  get paginatedArticulos(): ArticuloAlmacenDTO[] {

    const startIndex = this.currentPage * this.pageSize;

    const endIndex = startIndex + this.pageSize;

    return this.articulos.slice(startIndex, endIndex);
  }

  /**
   * Método que obtiene los artículos del almacén y los muestra con cards
   * @returns void
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
        error: (errorResponse) => {
          switch (errorResponse.error.message) {
            case `No hay artículos`:
              Swal.fire('Error', 'No hay artículos', 'error');
              break;
            default:
              Swal.fire('Error', 'Ha ocurrido un error durante el proceso', 'error');
          }
        }
      });
  }

  /**
   * Método para ocultar la tabla de artículos
   * @returns void
   * @memberof VerArticulosComponent
   */
  ocultarTabla(): void {

    this.mostrarTabla = false;
    this.currentPage = 0;
  }

  /**
   * Método para cambiar de página en la tabla de artículos
   * @param event
   * @returns void
   * @memberof VerArticulosComponent
   */
  onPageChange(event: any): void {

    this.currentPage = event.pageIndex;
  }

}
