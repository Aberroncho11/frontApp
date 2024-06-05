import { Component } from '@angular/core';
import { ArticuloServicio } from '../../../services/articulo.service';
import { ArticuloAlmacenDTO } from '../../../interfaces/articulo/articuloAlmacenDTO.interface';

@Component({
  selector: 'ver-articulos',
  templateUrl: './ver-articulos.component.html',
  styleUrls: ['./ver-articulos.component.css'],
})
export class VerArticulosComponent {

  // Array de artículos
  public articulos: ArticuloAlmacenDTO[] = [];

  // Variable para mostrar la tabla
  public mostrarTabla: boolean = false;

  // Variables para la paginación
  // Variable para el tamaño de la página
  public pageSize = 9;
  // Variable para el total de artículos
  public totalItems = 0;
  // Variable para la página actual
  public currentPage = 0;

  constructor(private articuloServicio: ArticuloServicio) {}

  // Metodo para obtener los artículos
  verArticulos(): void {
    this.articuloServicio.getArticulos()
      .subscribe(
        (articulos: ArticuloAlmacenDTO[]) => {
          // Asignar los artículos obtenidos
          this.articulos = articulos;
          // Asignar el total de artículos
          this.totalItems = articulos.length;
          // Mostrar la tabla
          this.mostrarTabla = true;
        },
        // Manejo de errores
        (error) => {
          console.error('Error al obtener los artículos:', error);
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
  get paginatedArticulos(): ArticuloAlmacenDTO[] {
    // Calcular el índice de inicio y fin
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // Retornar los artículos paginados
    return this.articulos.slice(startIndex, endIndex);
  }
}
