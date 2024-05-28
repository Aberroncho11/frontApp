import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { UserDTO } from '../interfaces/user/userDTO.interface';
import { environment } from '../../environments/environments';
import { UserCreacionDTO } from '../interfaces/user/userCreacionDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getUsers():Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${ this.baseUrl }/verUsuarios`);
  }

  addUser( user: UserCreacionDTO ): Observable<UserCreacionDTO> {
    return this.http.post<UserCreacionDTO>(`${ this.baseUrl }/crearUsuario`, user );
  }

  updateUser( user: UserCreacionDTO, idUser: number ): Observable<UserCreacionDTO> {
    return this.http.put<UserCreacionDTO>(`${ this.baseUrl }/modificarUsuario/${ idUser }`, user );
  }

  deleteUser( idUsuario: number ): Observable<boolean> {
    return this.http.delete(`${ this.baseUrl }/eliminarUsuario/${ idUsuario }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }
}
