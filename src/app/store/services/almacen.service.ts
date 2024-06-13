import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { AlmacenDTO } from '../interfaces/almacen/almacenDTO.interface';

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
  getEstanteriaPorId( idEstanteria: number): Observable<any>{

    return this.http.get<any>(`${this.baseUrl}/verEstanteriaPorId/${idEstanteria}`);
  }

  /**
   * Método para obtener todos los almacenes
   * @returns Observable<AlmacenDTO[]>
   * @memberof AlmacenServicio
   */
  addAlmacen( almacen: AlmacenDTO): Observable<AlmacenDTO>{

    return this.http.patch<AlmacenDTO>(`${ this.baseUrl }/addAlmacen`, almacen );
  }

}
