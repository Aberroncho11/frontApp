import { Component } from '@angular/core';
import { PedidoDTO } from '../../../interfaces/pedido/pedidoDTO.interface';
import { PedidoServicio } from '../../../services/pedido.service';

@Component({
  selector: 'ver-pedidos',
  templateUrl: './ver-pedidos.component.html',
  styleUrls: ['./ver-pedidos.component.css']
})
export class VerPedidosComponent {

  public pedidos: PedidoDTO[] = [];
  public mostrarTabla: boolean = false;

  constructor(private pedidoServicio: PedidoServicio) { }

  verPedidos(): void {

    this.pedidoServicio.getPedidos()
      .subscribe(pedidos => {
        this.pedidos = pedidos;
        this.mostrarTabla = true;
      });
  }

  ocultarTabla(): void {

    this.mostrarTabla = false;
  }

}
