import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { UsuarioDTO } from '../interfaces/usuario/usuarioDTO.interface';
import { environment } from '../../environments/environments';
import { UsuarioPostDTO } from '../interfaces/usuario/usuarioPostDTO.interface';
import { UsuarioGetPorIdDTO } from '../interfaces/usuario/usuarioGetPorIdDTO.interface';
import { AuthService } from '../../auth/services/auth.service';
import { UsuarioPutDTO } from '../interfaces/usuario/usuarioPutDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServicio {

  // Url base
  private baseUrl: string = environment.baseUrl;

  // Constructor
  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Método para verificar si el email ya existe
   * @param email
   * @returns Observable<boolean>
   * @memberof UsuarioServicio
   */
  checkEmail(email: string): Observable<boolean> {
    // Retornar si el email existe
    return this.http.get<boolean>(`${this.baseUrl}/checkEmail/${email}`).pipe(
      tap(exists => console.log('Email exists:', exists)),
      catchError(error => {
        console.error('Error checking email:', error);
        return of(false); // Manejar el error adecuadamente según tu caso
      })
    );
  }

  /**
   * Método para verificar si el email ya existe
   * @param email
   * @returns Observable<boolean>
   * @memberof UsuarioServicio
   */
  checkEmailNotExists(email: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.baseUrl}/checkEmail/${email}`).pipe(
      map(response => response.exists)
    );
  }

  /**
   * Método para verificar si el nickname ya existe
   * @param
   * @returns Observable<boolean>
   * @memberof UsuarioServicio
   */
  checkNickname(nickname: string): Observable<boolean> {
    // Retornar si el nickname existe
    return this.http.get<boolean>(`${this.baseUrl}/checkNickname/${nickname}`).pipe(
      tap(exists => console.log('Nickname exists:', exists)),
      catchError(error => {
        console.error('Error checking nickname:', error);
        return of(false); // Manejar el error adecuadamente según tu caso
      })
    );
  }

  /**
   * Método para obtener todos los usuarios
   * @returns Observable<UsuarioDTO[]>
   * @memberof UsuarioServicio
   */
  getUsuarios():Observable<UsuarioDTO[]> {
    // Retornar usuarios
    return this.http.get<UsuarioDTO[]>(`${ this.baseUrl }/verUsuarios`);
  }

  /**
   * Método para obtener un usuario por id
   * @param idUsuario
   * @returns Observable<UsuarioGetPorIdDTO>
   * @memberof UsuarioServicio
   */
  getUsuarioPorId(idUsuario: number):Observable<UsuarioGetPorIdDTO> {
    // Retornar usuario por id
    return this.http.get<UsuarioGetPorIdDTO>(`${this.baseUrl}/verUsuarioPorId/${idUsuario}`);
  }

  /**
   * Método para agregar un usuario
   * @param usuario
   * @returns Observable<any>
   * @memberof UsuarioServicio
   */
  addUsuario( usuario: UsuarioPostDTO ): Observable<any> {

    // Crear un nuevo formulario
    const formData: FormData = new FormData();
    formData.append('perfil', usuario.perfil.toString());
    formData.append('password', usuario.password);
    formData.append('email', usuario.email);
    formData.append('nickname', usuario.nickname);

    // Retornar usuario por id
    return this.http.post<any>(`${ this.baseUrl }/crearUsuario`, formData );
  }

  /**
   * Método para actualizar un usuario
   * @param usuario
   * @param idUsuario
   * @returns Observable<UsuarioPutDTO>
   * @memberof UsuarioServicio
   */
  updateUsuario( usuario: UsuarioPutDTO, idUsuario: number ): Observable<UsuarioPutDTO> {

    // Crear un nuevo formulario
    const formData: FormData = new FormData();
    formData.append('perfil', usuario.perfil.toString());
    formData.append('password', usuario.password);
    formData.append('email', usuario.email);
    formData.append('estadoUsuario', usuario.estadoUsuario);
    formData.append('nickname', usuario.nickname);

    // Retornar usuario por id
    return this.http.put<UsuarioPutDTO>(`${ this.baseUrl }/modificarUsuario/${ idUsuario }`, formData );
  }

  /**
   * Método para eliminar un usuario
   * @param idUsuario
   * @returns Observable<boolean>
   * @memberof UsuarioServicio
   */
  deleteUsuario( idUsuario: number ): Observable<boolean> {

    // Eliminar usuario
    return this.http.delete(`${ this.baseUrl }/eliminarUsuario/${ idUsuario }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }

}
