import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { ArticuloAlmacenDTO } from '../interfaces/articulo/articuloAlmacenDTO.interface';
import { ArticuloPostDTO } from '../interfaces/articulo/articuloPostDTO.interface';
import { ArticuloDTO } from '../interfaces/articulo/articuloDTO.interface';
import { ArticuloPutDTO } from '../interfaces/articulo/articuloPutDTO.interface';
import { AlmacenDTO } from '../interfaces/almacen/almacenDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticuloServicio{

  private baseUrl: string = environment.baseUrl;

  private http = inject(HttpClient);

  /**
   * Método para obtener todos los articulos
   * @returns Observable<ArticuloAlmacenDTO[]>
   * @memberof ArticuloServicio
   */
  getArticulos(): Observable<ArticuloAlmacenDTO[]> {
    return this.http.get<ArticuloAlmacenDTO[]>(`${this.baseUrl}/verArticulos`);
  }

  /**
   * Método para obtener un articulo por id
   * @param idArticulo
   * @returns Observable<ArticuloDTO>
   * @memberof ArticuloServicio
   */
  getArticuloPorNombre(nombre: string):Observable<ArticuloDTO> {
    return this.http.get<ArticuloDTO>(`${this.baseUrl}/verArticuloPorNombre/${nombre}`);
  }

  getEstanteriasVacias(): Observable<AlmacenDTO[]> {
    return this.http.get<AlmacenDTO[]>(`${this.baseUrl}/verEstanteriasVacias`);
  }

  /**
   * Método para agregar un articulo
   * @param articulo
   * @returns Observable<any>
   * @memberof ArticuloServicio
   */
  addArticulo( articulo: ArticuloPostDTO, almacen: AlmacenDTO): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('Nombre', articulo.nombre);
    formData.append('Descripcion', articulo.descripcion);
    formData.append('Fabricante', articulo.fabricante);
    formData.append('Peso', articulo.peso.toString());
    formData.append('Altura', articulo.altura.toString());
    formData.append('Ancho', articulo.ancho.toString());
    formData.append('Precio', articulo.precio.toString());

<<<<<<< HEAD
=======
    formData.append('IdEstanteria', almacen.idEstanteria.toString());
    formData.append('Cantidad', almacen.cantidad.toString());

    // Si hay foto
>>>>>>> f03d08c574775c7539a261ca246daa280e009f81
    if (articulo.foto) {
      formData.append('Foto', articulo.foto, articulo.foto.name);
    }

<<<<<<< HEAD
    return this.http.post<any>(`${ this.baseUrl }/crearArticulo`, formData );
=======
    // Retornar el articulo
    return this.http.post<any>(`${ this.baseUrl }/crearArticulo`, formData,  );
>>>>>>> f03d08c574775c7539a261ca246daa280e009f81
  }

  /**
   * Método para actualizar un articulo
   * @param articulo
   * @param idArticulo
   * @returns Observable<ArticuloPutDTO>
   * @memberof ArticuloServicio
   */
  updateArticulo( articulo: ArticuloPutDTO, idArticulo: number ): Observable<ArticuloPutDTO> {

    const formData: FormData = new FormData();
    formData.append('Descripcion', articulo.descripcion);
    formData.append('Fabricante', articulo.fabricante);
    formData.append('Peso', articulo.peso);
    formData.append('Altura', articulo.altura);
    formData.append('Ancho', articulo.ancho);
    formData.append('Precio', articulo.precio);
    formData.append('EstadoArticulo', articulo.estadoArticulo);

    if (articulo.foto) {
      formData.append('Foto', articulo.foto, articulo.foto.name);
    }

    return this.http.put<ArticuloPutDTO>(`${ this.baseUrl }/modificarArticulo/${ idArticulo }`, formData );
  }

  /**
   * Método para borrar una foto
   * @param foto
   * @returns Observable<boolean>
   * @memberof ArticuloServicio
   */
  borrarFoto(foto : string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/borrarFoto/${foto}`)
      .pipe(
        map(resp => true),
        catchError(err => of(false)),
      );
  }

  /**
   * Método para eliminar un articulo
   * @param idArticulo
   * @returns Observable<boolean>
   * @memberof ArticuloServicio
   */
  deleteArticle( nombre: string ): Observable<any> {

    return this.http.delete(`${ this.baseUrl }/eliminarArticulo/${ nombre }`);
  }
}
