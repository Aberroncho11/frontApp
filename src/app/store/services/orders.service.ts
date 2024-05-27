import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { OrderDTO } from '../interfaces/order/orderDTO.interface';
import { OrderCreacionDTO } from '../interfaces/order/orderCreacionDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getPedidos():Observable<OrderDTO[]> {
    return this.http.get<OrderDTO[]>(`${ this.baseUrl }/verPedidos`);
  }

  addPedido( order: OrderCreacionDTO ): Observable<OrderCreacionDTO> {
    return this.http.post<OrderCreacionDTO>(`${ this.baseUrl }/crearPedido`, order );
  }
}
