import { Component, ViewChild } from '@angular/core';
import { PedidoDTO } from '../../../interfaces/pedido/pedidoDTO.interface';
import { PedidoServicio } from '../../../services/pedido.service';
import Swal from 'sweetalert2';
import { ProductoDTO } from '../../../interfaces/producto/productoDTO.interface';

@Component({
  selector: 'ver-pedidos',
  templateUrl: './ver-pedidos.component.html',
  styleUrls: ['./ver-pedidos.component.css']
})
export class VerPedidosComponent {

  public pedidos: PedidoDTO[] = [];

  public producto: ProductoDTO[] = [];

  public mostrarTabla: boolean = false;

  public pageSize = 9;

  public totalItems = 0;

  public currentPage = 0;

  constructor(private pedidoServicio: PedidoServicio) {}

  /**
   * Método para obtener los pedidos
   * @memberof VerPedidosComponent
   * @description Método para obtener los pedidos
   */
  verPedidos(): void {
    this.pedidoServicio.getPedidos().subscribe({
      next: (pedidos: PedidoDTO[]) => {

        this.pedidos = pedidos;

        pedidos.forEach(pedido => {
          pedido.producto.forEach(producto => {
            this.producto.push(producto);
          });
        });

        this.totalItems = pedidos.length;

        this.mostrarTabla = true;
      },
      error: (error) => {
        console.error('Error al obtener los pedidos:', error);

        if(error.message = "No hay pedidos"){
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No hay pedidos registrados.'
          })
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Error al obtener los pedidos',
            text: 'Ha ocurrido un error al obtener los pedidos. Por favor, inténtelo de nuevo más tarde.'
          })
        }

      }
    });
  }

  /**
   * Método para ocultar la tabla
   * @returns void
   * @memberof VerPedidosComponent
   * @description Método para ocultar la tabla
   */
  ocultarTabla(): void {
    // Ocultar la tabla
    this.mostrarTabla = false;
    // Reiniciar la página actual
    this.currentPage = 0;
  }

  /**
   * Método para cambiar de página
   * @param event
   * @memberof VerPedidosComponent
   * @description Método para cambiar de página
   */
  onPageChange(event: any): void {
    // Actualizar la página actual
    this.currentPage = event.pageIndex;
  }

  /**
   * Método para obtener los pedidos paginados
   * @returns PedidoDTO[]
   * @memberof VerPedidosComponent
   * @description Método para obtener los pedidos paginados
   */
  get paginatedPedidos(): PedidoDTO[] {
    // Calcular el índice de inicio y fin
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // Retornar los artículos paginados
    return this.pedidos.slice(startIndex, endIndex);
  }
}
