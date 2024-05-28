import { Component } from '@angular/core';
import { OrderDTO } from '../../../interfaces/order/orderDTO.interface';
import { OrderService } from '../../../services/orders.service';

@Component({
  selector: 'ver-pedidos',
  templateUrl: './ver-pedidos.component.html',
  styleUrls: ['./ver-pedidos.component.css']
})
export class VerPedidosComponent {

  public pedidos: OrderDTO[] = [];

  constructor(private orderService: OrderService) { }

  verPedidos(): void {
    this.orderService.getPedidos()
    .subscribe( pedidos => this.pedidos = pedidos);
  }

}
