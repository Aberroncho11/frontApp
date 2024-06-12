import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { AlmacenDTO } from '../interfaces/almacen/almacenDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class AlmacenServicio {

  // Url base
  private baseUrl: string = environment.baseUrl;

  // Constructor
  constructor(private http: HttpClient) { }

  /**
   * Método para obtener todos los almacenes
   * @param idEstanteria
   * @returns Observable<any>
   * @memberof AlmacenServicio
   */
  getEstanteriaPorId( idEstanteria: number): Observable<any>{

    // Retornar estanteria por id
    return this.http.get<any>(`${this.baseUrl}/verEstanteriaPorId/${idEstanteria}`);
  }

  meterArticuloEnEstanteria( idArticulo: number, idEstanteria: number): Observable<any>{
    // Meter articulo en estanteria
    return this.http.patch<any>(`${this.baseUrl}/addArticuloAEstanteria/${idArticulo}/${idEstanteria}`, {});
  }

  /**
   * Método para obtener todos los almacenes
   * @returns Observable<AlmacenDTO[]>
   * @memberof AlmacenServicio
   */
  addAlmacen( almacen: AlmacenDTO): Observable<AlmacenDTO>{

    // Añadir a estanteria
    return this.http.patch<AlmacenDTO>(`${ this.baseUrl }/addAlmacen`, almacen );
  }

}
