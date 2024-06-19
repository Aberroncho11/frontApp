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
   * @param nombre
   * @returns Observable<ArticuloDTO>
   * @memberof ArticuloServicio
   */
  getArticuloPorNombre(nombre: string):Observable<ArticuloDTO> {
    return this.http.get<ArticuloDTO>(`${this.baseUrl}/verArticuloPorNombre/${nombre}`);
  }

  /**
   * Método para obtener un articulo por id
   * @param idArticulo
   * @returns Observable<ArticuloDTO>
   * @memberof ArticuloServicio
   */
  getArticuloPorId(idArticulo: number):Observable<ArticuloDTO> {
    return this.http.get<ArticuloDTO>(`${this.baseUrl}/verArticuloPorId/${idArticulo}`);
  }


  /**
   * Método para verificar si el nombre ya existe
   * @param nombre
   * @returns Observable<boolean>
   * @memberof ArticuloServicio
   */
  checkNombre(nombre: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/checkNombre/${nombre}`);
  }

  /**
   * Método para obtener las estanterias vacias
   * @returns Observable<AlmacenDTO[]>
   * @memberof ArticuloServicio
   */
  getEstanteriasVacias(): Observable<AlmacenDTO[]> {
    return this.http.get<AlmacenDTO[]>(`${this.baseUrl}/verEstanteriasVacias`);
  }

  /**
   * Método para obtener las estanterias con articulos
   * @returns Observable<AlmacenDTO[]>
   * @memberof ArticuloServicio
   */
  getEstanteriasConArticulos(): Observable<AlmacenDTO[]> {
    return this.http.get<AlmacenDTO[]>(`${this.baseUrl}/verEstanteriasConArticulos`);
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

    formData.append('IdEstanteria', almacen.idEstanteria.toString());
    formData.append('Cantidad', almacen.cantidad.toString());

    // Si hay foto
    if (articulo.foto) {
      formData.append('Foto', articulo.foto, articulo.foto.name);
    }

    return this.http.post<any>(`${ this.baseUrl }/crearArticulo`, formData );

  }

  /**
   * Método para actualizar un articulo
   * @param articulo
   * @param idArticulo
   * @returns Observable<ArticuloPutDTO>
   * @memberof ArticuloServicio
   */
  updateArticulo( articulo: ArticuloPutDTO, almacen: AlmacenDTO | null, nombre: string ): Observable<ArticuloPutDTO> {

    const formData: FormData = new FormData();
    formData.append('Descripcion', articulo.descripcion);
    formData.append('Nombre', articulo.nombre);
    formData.append('Descripcion', articulo.descripcion);
    formData.append('Fabricante', articulo.fabricante);
    formData.append('Peso', articulo.peso);
    formData.append('Altura', articulo.altura);
    formData.append('Ancho', articulo.ancho);
    formData.append('Precio', articulo.precio);
    formData.append('EstadoArticulo', articulo.estadoArticulo);

    if (almacen) {
      formData.append('IdEstanteria', almacen.idEstanteria.toString());
      formData.append('Cantidad', almacen.cantidad.toString());
    }

    if (articulo.foto) {
      formData.append('Foto', articulo.foto, articulo.foto.name);
    }

    return this.http.put<ArticuloPutDTO>(`${ this.baseUrl }/modificarArticulo/${ nombre }`, formData );
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
