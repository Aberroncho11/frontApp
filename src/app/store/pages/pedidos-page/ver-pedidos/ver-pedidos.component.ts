import { Component, ViewChild } from '@angular/core';
import { PedidoDTO } from '../../../interfaces/pedido/pedidoDTO.interface';
import { PedidoServicio } from '../../../services/pedido.service';

@Component({
  selector: 'ver-pedidos',
  templateUrl: './ver-pedidos.component.html',
  styleUrls: ['./ver-pedidos.component.css']
})
export class VerPedidosComponent {

  // Array de artículos
  public pedidos: PedidoDTO[] = [];

  // Variable para mostrar la tabla
  public mostrarTabla: boolean = false;

  // Variables para la paginación
  // Variable para el tamaño de la página
  public pageSize = 9;
  // Variable para el total de artículos
  public totalItems = 0;
  // Variable para la página actual
  public currentPage = 0;

  constructor(private pedidoServicio: PedidoServicio) {}

  // Metodo para obtener los artículos
  verPedidos(): void {
    this.pedidoServicio.getPedidos()
      .subscribe(
        (pedidos: PedidoDTO[]) => {
          // Asignar los artículos obtenidos
          this.pedidos = pedidos;
          // Asignar el total de artículos
          this.totalItems = pedidos.length;
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
  get paginatedPedidos(): PedidoDTO[] {
    // Calcular el índice de inicio y fin
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // Retornar los artículos paginados
    return this.pedidos.slice(startIndex, endIndex);
  }
}
