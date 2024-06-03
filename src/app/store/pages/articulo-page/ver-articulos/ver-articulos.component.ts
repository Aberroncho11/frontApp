import { Component, OnInit } from '@angular/core';
import { ArticuloServicio } from '../../../services/articulo.service';
import { ArticuloAlmacenDTO } from '../../../interfaces/articulo/articuloAlmacenDTO.interface';

@Component({
  selector: 'ver-articulos',
  templateUrl: './ver-articulos.component.html',
  styleUrls: ['./ver-articulos.component.css']
})
export class VerArticulosComponent {
  public articulos: ArticuloAlmacenDTO[] = [];
  public mostrarTabla: boolean = false;
  public pageSize = 9;
  public totalItems = 0;
  public currentPage = 0;

  constructor(private articuloServicio: ArticuloServicio) {}

  verArticulos(): void {
    this.articuloServicio.getArticulos()
      .subscribe(
        (articulos: ArticuloAlmacenDTO[]) => {
          this.articulos = articulos;
          this.totalItems = articulos.length;
          this.mostrarTabla = true;
        },
        (error) => {
          console.error('Error al obtener los artículos:', error);
        }
      );
  }

  ocultarTabla(): void {
    this.mostrarTabla = false;
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex; // Actualizar la página actual
  }

  get paginatedArticulos(): ArticuloAlmacenDTO[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.articulos.slice(startIndex, endIndex);
  }
}
