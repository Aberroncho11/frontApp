import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { PedidoDTO } from '../interfaces/pedido/pedidoDTO.interface';
import { PedidoPostDTO } from '../interfaces/pedido/pedidoPostDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoServicio {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getPedidos():Observable<PedidoDTO[]> {
    return this.http.get<PedidoDTO[]>(`${ this.baseUrl }/verPedidos`);
  }

  addPedido( pedido: PedidoPostDTO ): Observable<PedidoPostDTO> {
    return this.http.post<PedidoPostDTO>(`${ this.baseUrl }/crearPedido`, pedido );
  }
}
