import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { PedidoDTO } from '../interfaces/pedido/pedidoDTO.interface';
import { PedidoPostDTO } from '../interfaces/pedido/pedidoPostDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoServicio {

  private baseUrl: string = environment.baseUrl;

  private http = inject(HttpClient);

  /**
   * Método para obtener todos los pedidos
   * @returns Observable<PedidoDTO[]>
   * @memberof PedidoServicio
   */
  getPedidos():Observable<PedidoDTO[]> {
    return this.http.get<PedidoDTO[]>(`${ this.baseUrl }/verPedidos`);
  }

  /**
   * Metodo para obtener un pedido por id
   * @param pedido
   * @returns Observable<PedidoDTO>
   * @memberof PedidoServicio
   */
  addPedido( pedido: PedidoPostDTO ): Observable<PedidoPostDTO> {
    return this.http.post<PedidoPostDTO>(`${ this.baseUrl }/crearPedido`, pedido );
  }
}
