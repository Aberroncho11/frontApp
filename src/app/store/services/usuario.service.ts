import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { UsuarioDTO } from '../interfaces/usuario/usuarioDTO.interface';
import { environment } from '../../environments/environments';
import { UsuarioPostDTO } from '../interfaces/usuario/usuarioPostDTO.interface';
import { UsuarioGetPorIdDTO } from '../interfaces/usuario/usuarioGetPorIdDTO.interface';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServicio {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUsuarios():Observable<UsuarioDTO[]> {

    return this.http.get<UsuarioDTO[]>(`${ this.baseUrl }/verUsuarios`);
  }

  getUsuarioPorId(idUsuario: number):Observable<UsuarioGetPorIdDTO> {

    return this.http.get<UsuarioGetPorIdDTO>(`${this.baseUrl}/verUsuarioPorId/${idUsuario}`);
  }

  addUsuario( usuario: UsuarioPostDTO ): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('perfil', usuario.perfil.toString());
    formData.append('password', usuario.password);
    formData.append('email', usuario.email);
    formData.append('nickname', usuario.nickname);

    return this.http.post<any>(`${ this.baseUrl }/crearUsuario`, formData );
  }

  updateUsuario( usuario: UsuarioPostDTO, idUsuario: number ): Observable<UsuarioPostDTO> {

    const formData: FormData = new FormData();
    formData.append('perfil', usuario.perfil.toString());
    formData.append('password', usuario.password);
    formData.append('email', usuario.email);
    formData.append('nickname', usuario.nickname);

    return this.http.put<UsuarioPostDTO>(`${ this.baseUrl }/modificarUsuario/${ idUsuario }`, formData );
  }

  deleteUsuario( idUsuario: number ): Observable<boolean> {

    return this.http.delete(`${ this.baseUrl }/eliminarUsuario/${ idUsuario }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }

}
