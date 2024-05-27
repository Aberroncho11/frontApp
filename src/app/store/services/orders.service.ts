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
    return this.http.get<OrderDTO[]>(`${ this.baseUrl }/VerPedidos`);
  }

  addPedido( order: OrderCreacionDTO ): Observable<OrderCreacionDTO> {
    return this.http.post<OrderCreacionDTO>(`${ this.baseUrl }/CrearPedidos`, order );
  }

  // updatePedido( order: OrderCreacionDTO, idOrder: number ): Observable<OrderCreacionDTO> {
  //   return this.http.put<OrderCreacionDTO>(`${ this.baseUrl }/ModificarPedidos/${ idOrder }`, order );
  // }

  // deletePedido( idOrder: number ): Observable<boolean> {
  //   return this.http.delete(`${ this.baseUrl }/EliminarPedidos/${ idOrder }`)
  //     .pipe(
  //       map( resp => true ),
  //       catchError( err => of(false) ),
  //     );
  // }
}
