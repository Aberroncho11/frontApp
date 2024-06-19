import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { UsuarioDTO } from '../interfaces/usuario/usuarioDTO.interface';
import { environment } from '../../environments/environments';
import { UsuarioPostDTO } from '../interfaces/usuario/usuarioPostDTO.interface';
import { UsuarioPutDTO } from '../interfaces/usuario/usuarioPutDTO.interface';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServicio{

  private baseUrl: string = environment.baseUrl;

  private http = inject(HttpClient);

  private jwtHelper: JwtHelperService

  constructor() {
    this.jwtHelper = new JwtHelperService();
   }

  /**
   * Método para verificar si el email ya existe
   * @param email
   * @returns Observable<boolean>
   * @memberof UsuarioServicio
   */
  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/checkEmail/${email}`);
  }

  /**
   * Método para verificar si el nickname ya existe
   * @param
   * @returns Observable<boolean>
   * @memberof UsuarioServicio
   */
  checkNickname(nickname: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/checkNickname/${nickname}`);
  }

  /**
   * Método para obtener todos los usuarios
   * @returns Observable<UsuarioDTO[]>
   * @memberof UsuarioServicio
   */
  getUsuarios():Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${ this.baseUrl }/verUsuarios`);
  }

  /**
   * Método para obtener un usuario por id
   * @param idUsuario
   * @returns Observable<UsuarioGetPorIdDTO>
   * @memberof UsuarioServicio
   */
  getUsuarioPorNickname(nickname: string):Observable<UsuarioDTO> {

    return this.http.get<UsuarioDTO>(`${this.baseUrl}/verUsuarioPorNickname/${nickname}`);
  }

  /**
   * Método para obtener el usuario a partir del token
   * @returns Observable<number | null>
   * @memberof UsuarioServicio
   */
  getUserFromToken(): Observable<number | null> {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      var idUsuario = Number(decodedToken['IdUsuario']);
      return of(idUsuario);
    }
    return of(null);
  }

    /**
   * Método para obtener el usuario a partir del token
   * @returns Observable<number | null>
   * @memberof UsuarioServicio
   */
    getNicknameFromToken(): Observable<string | null> {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        var nickname = String(decodedToken['Nickname']);
        return of(nickname);
      }
      return of(null);
    }


  /**
   * Método para agregar un usuario
   * @param usuario
   * @returns Observable<any>
   * @memberof UsuarioServicio
   */
  addUsuario( usuario: UsuarioPostDTO ): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('perfil', usuario.perfil.toString());
    formData.append('password', usuario.password);
    formData.append('email', usuario.email);
    formData.append('nickname', usuario.nickname);

    return this.http.post<any>(`${ this.baseUrl }/crearUsuario`, formData );
  }

  /**
   * Método para actualizar un usuario
   * @param usuario
   * @param idUsuario
   * @returns Observable<UsuarioPutDTO>
   * @memberof UsuarioServicio
   */
  updateUsuario( usuario: UsuarioPutDTO, nickanme: string ): Observable<UsuarioPutDTO> {

    const formData: FormData = new FormData();
    formData.append('perfil', usuario.perfil.toString());
    formData.append('email', usuario.email);
    formData.append('estadoUsuario', usuario.estadoUsuario);
    formData.append('nickname', usuario.nickname);

    return this.http.put<UsuarioPutDTO>(`${ this.baseUrl }/modificarUsuario/${ nickanme }`, formData );
  }

  /**
   * Método para eliminar un usuario
   * @param idUsuario
   * @returns Observable<boolean>
   * @memberof UsuarioServicio
   */
  deleteUsuario( nickname: string ): Observable<boolean> {

    return this.http.delete(`${ this.baseUrl }/eliminarUsuario/${ nickname }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }

}
