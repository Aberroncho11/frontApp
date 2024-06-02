import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { AlmacenDTO } from '../interfaces/almacen/almacenDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class AlmacenServicio {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getEstanteriaPorId( idEstanteria: number): Observable<any>{

    return this.http.get<any>(`${this.baseUrl}/verEstanteriaPorId/${idEstanteria}`);
  }

  addAlmacen( almacen: AlmacenDTO): Observable<AlmacenDTO>{

    return this.http.patch<AlmacenDTO>(`${ this.baseUrl }/addAlmacen`, almacen );
  }

}
