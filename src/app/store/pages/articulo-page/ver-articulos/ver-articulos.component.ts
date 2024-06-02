import { Component } from '@angular/core';
import { ArticuloAlmacenDTO } from '../../../interfaces/articulo/articuloAlmacenDTO.interface';
import { ArticuloServicio } from '../../../services/articulo.service';
import { PaginacionDTO } from '../../../interfaces/paginacionDTO.interface';

@Component({
  selector: 'ver-articulos',
  templateUrl: './ver-articulos.component.html',
  styleUrls: ['./ver-articulos.component.css']
})
export class VerArticulosComponent {

  public articulos: ArticuloAlmacenDTO[] = [];
  public mostrarTabla: boolean = false;
  public pageNumber: number = 1;
  public pageSize: number = 10;
  public totalItems: number = 0;
  public Math = Math;

  constructor(private articuloServicio: ArticuloServicio) { }

  verArticulos(): void {
    this.articuloServicio.getArticulos(this.pageNumber, this.pageSize).subscribe(
      (pagedResult: PaginacionDTO<ArticuloAlmacenDTO>) => {
        this.articulos = pagedResult.items;
        this.totalItems = pagedResult.totalItems;
        this.mostrarTabla = true;
      }
    );
  }

  onPageChange(pageNumber: number): void {
    this.pageNumber = pageNumber;
    this.verArticulos(); // Aquí deberías actualizar la página con los nuevos datos
  }

  ocultarTabla(): void {
    this.mostrarTabla = false;
  }
}
