import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { UserDTO } from '../interfaces/user/userDTO.interface';
import { environment } from '../../environments/environments';
import { UserCreacionDTO } from '../interfaces/user/userCreacionDTO.interface';
import { UserGetPorIdDTO } from '../interfaces/user/usuarioGetPorIdDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getUsers():Observable<UserDTO[]> {

    return this.http.get<UserDTO[]>(`${ this.baseUrl }/verUsuarios`);
  }

  getUserPorId(idUser: number):Observable<UserGetPorIdDTO> {

    return this.http.get<UserGetPorIdDTO>(`${this.baseUrl}/verUsuariosPorId/${idUser}`);
  }

  addUser( usuario: UserCreacionDTO ): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('idProfile', usuario.idProfile.toString());
    formData.append('password', usuario.password);
    formData.append('email', usuario.email);
    formData.append('nickname', usuario.nickname);

    return this.http.post<any>(`${ this.baseUrl }/crearUsuarios`, formData );
  }

  updateUser( usuario: UserCreacionDTO, idUser: number ): Observable<UserCreacionDTO> {

    const formData: FormData = new FormData();
    formData.append('idProfile', usuario.idProfile.toString());
    formData.append('password', usuario.password);
    formData.append('email', usuario.email);
    formData.append('nickname', usuario.nickname);

    return this.http.put<UserCreacionDTO>(`${ this.baseUrl }/modificarUsuarios/${ idUser }`, formData );
  }

  deleteUser( idUsuario: number ): Observable<boolean> {

    return this.http.delete(`${ this.baseUrl }/eliminarUsuarios/${ idUsuario }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }
}
