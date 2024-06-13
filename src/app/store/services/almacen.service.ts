import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { AlmacenAddDTO } from '../interfaces/almacen/almacenAddDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class AlmacenServicio {

  private baseUrl: string = environment.baseUrl;

  private http = inject(HttpClient);

  /**
   * Método para obtener todos los almacenes
   * @param idEstanteria
   * @returns Observable<any>
   * @memberof AlmacenServicio
   */
  getEstanteriaPorArticulo( articuloAlmacen: number): Observable<any>{

    return this.http.get<any>(`${this.baseUrl}/verEstanteriaPorArticulo/${articuloAlmacen}`);
  }

  /**
   * Método para obtener todos los almacenes
   * @returns Observable<AlmacenDTO[]>
   * @memberof AlmacenServicio
   */
  addAlmacen( almacen: AlmacenAddDTO ): Observable<AlmacenAddDTO>{

    return this.http.patch<AlmacenAddDTO>(`${ this.baseUrl }/addAlmacen`, almacen );
  }

}
