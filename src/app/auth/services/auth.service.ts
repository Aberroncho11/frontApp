import { HttpClient } from '@angular/common/http';
import { Injectable, inject, computed, signal} from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AuthStatus, LoginResponse, User } from '../interfaces';
import { environment } from '../../environments/environments';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Url base de la API
  private readonly baseUrl: string = environment.baseUrl;

  // Inyectamos el servicio HttpClient
  private http = inject(HttpClient);

  // Propiedad para gestionar el token JWT
  private jwtHelper: JwtHelperService

  // Propiedades reactivas
  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //! Al mundo exterior
  public currentUser = computed( () => this._currentUser() )
  public authStatus = computed( () => this._authStatus() )

  // constructor
  constructor() {
    this.jwtHelper = new JwtHelperService();
    this.checkAuthStatus();
   }

  /**
   * Método para autenticar al usuario
   * @param user
   * @param token
   * @returns
   * @private
   * @memberof AuthService
   */
  private setAuthentication(user: User, token: string): boolean {
    // Guardamos el usuario y el token en el almacenamiento local
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  /**
   * Método para iniciar sesión
   * @param email
   * @param password
   * @returns
   * @memberof AuthService
   */
  login( email: string, password: string): Observable<boolean> {
    // Url de login y cuerpo de la petición
    const url = `${this.baseUrl}/login`;
    const body = { email, password };

    // Realizamos la petición
    return this.http.post<LoginResponse>(url, body)
    .pipe(
      // Mapeamos la respuesta
      map( ({user, token}) =>
        this.setAuthentication(user, token)),
      // Capturamos errores
      catchError( err => throwError( () => err.error.message)
      )
    );
  }

  /**
   * Método para obtener el rol del usuario desde el token
   * @returns
   * @memberof AuthService
   */
  getRoleFromToken(): string | null{
    // Obtenemos el token del almacenamiento local
    const token = localStorage.getItem('token');
    // Si no hay token, devolvemos null
    if (token) {
      // Decodificamos el token
      const decodedToken = this.jwtHelper.decodeToken(token);
      // Devolvemos el rol del token
      return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    // Si no hay token, devolvemos null
    } else {
      return null;
    }
  }

  /**
   * Método para comprobar el estado de autenticación
   * @returns
   * @memberof AuthService
   */
  checkAuthStatus(): void {
    // Obtenemos el token del almacenamiento local
    const token = localStorage.getItem('token');

    // Si no hay token, el estado de autenticación es "no autenticado"
    if (!token) {
      this._authStatus.set(AuthStatus.notAuthenticated);
      return;
    }

    // Si hay token, comprobamos si está caducado
    try {
      const isTokenValid = !this.jwtHelper.isTokenExpired(token);
      this._authStatus.set(isTokenValid ? AuthStatus.authenticated : AuthStatus.notAuthenticated);
    // Si hay algún error, el estado de autenticación es "no autenticado"
    } catch (error) {
      console.error('Error al validar el token:', error);
      this._authStatus.set(AuthStatus.notAuthenticated);
    }
  }

  // Método para cerrar sesión
  logout(){
    // Eliminamos el token del almacenamiento local
    localStorage.removeItem('token');
    // Eliminamos el usuario y establecemos el estado de autenticación como "no autenticado"
    this._currentUser.set(null);
    // Establecemos el estado de autenticación como "no autenticado"
    this._authStatus.set(AuthStatus.notAuthenticated);
  }

}
