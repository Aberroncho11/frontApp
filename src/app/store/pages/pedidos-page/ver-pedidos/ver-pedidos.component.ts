import { Component, ViewChild } from '@angular/core';
import { PedidoDTO } from '../../../interfaces/pedido/pedidoDTO.interface';
import { PedidoServicio } from '../../../services/pedido.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'ver-pedidos',
  templateUrl: './ver-pedidos.component.html',
  styleUrls: ['./ver-pedidos.component.css']
})
export class VerPedidosComponent {

  public dataSource = new MatTableDataSource<PedidoDTO>([]);
  public mostrarTabla: boolean = false;
  public displayedColumns: string[] = ['idPedido', 'idUsuario', 'codigoPostal', 'ciudad', 'telefono', 'contacto', 'direccion', 'provincia', 'estadoPedido', 'productos'];
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public pageSize = 10;
  public totalItems = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pedidoServicio: PedidoServicio) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  verPedidos(): void {
    this.pedidoServicio.getPedidos()
      .subscribe(
        (pedidos: PedidoDTO[]) => {
          this.dataSource.data = pedidos;
          this.totalItems = pedidos.length;
          console.log(this.dataSource.paginator);
          this.mostrarTabla = true;
        },
        (error) => {
          console.error('Error al obtener los pedidos:', error);
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
