import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { ArticuloAlmacenDTO } from '../interfaces/articulo/articuloAlmacenDTO.interface';
import { ArticuloPostDTO } from '../interfaces/articulo/articuloPostDTO.interface';
import { ArticuloDTO } from '../interfaces/articulo/articuloDTO.interface';
import { ArticuloPutDTO } from '../interfaces/articulo/articuloPutDTO.interface';
import { PaginacionDTO } from '../interfaces/paginacionDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticuloServicio {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getArticulos(): Observable<ArticuloAlmacenDTO[]> {

    return this.http.get<ArticuloAlmacenDTO[]>(`${this.baseUrl}/verArticulos`);
  }

  getArticuloPorId(idArticulo: number):Observable<ArticuloDTO> {

    return this.http.get<ArticuloDTO>(`${this.baseUrl}/verArticuloPorId/${idArticulo}`);
  }

  addArticulo( articulo: ArticuloPostDTO): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('Descripcion', articulo.descripcion);
    formData.append('Fabricante', articulo.fabricante);
    formData.append('Peso', articulo.peso.toString());
    formData.append('Altura', articulo.altura.toString());
    formData.append('Ancho', articulo.ancho.toString());
    formData.append('Precio', articulo.precio.toString());
    if (articulo.foto) {
      formData.append('Foto', articulo.foto, articulo.foto.name);
    }

    return this.http.post<any>(`${ this.baseUrl }/crearArticulo`, formData );
  }

  updateArticulo( articulo: ArticuloPutDTO, idArticulo: number ): Observable<ArticuloPutDTO> {

    const formData: FormData = new FormData();
    formData.append('Descripcion', articulo.descripcion);
    formData.append('Fabricante', articulo.fabricante);
    formData.append('Peso', articulo.peso.toString());
    formData.append('Altura', articulo.altura.toString());
    formData.append('Ancho', articulo.ancho.toString());
    formData.append('Precio', articulo.precio.toString());
    formData.append('EstadoArticulo', articulo.estadoArticulo.toString());
    if (articulo.foto) {
      formData.append('Foto', articulo.foto, articulo.foto.name);
    }

    return this.http.put<ArticuloPutDTO>(`${ this.baseUrl }/modificarArticulo/${ idArticulo }`, formData );
  }

  deleteArticle( idArticulo: number ): Observable<boolean> {

    return this.http.delete(`${ this.baseUrl }/eliminarArticulo/${ idArticulo }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }
}
