import { HttpClient } from '@angular/common/http';
import { Injectable, inject, computed, signal} from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AuthStatus, LoginResponse, User } from '../interfaces';
import { environment } from '../../environments/environments';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;

  private http = inject(HttpClient);

  private router = inject(Router);

  private jwtHelper: JwtHelperService

  private _currentUser = signal<User|null>(null);

  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed( () => this._currentUser() )

  public authStatus = computed( () => this._authStatus() )

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
    const url = `${this.baseUrl}/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body)
    .pipe(
      map( ({user, token}) =>
        this.setAuthentication(user, token)),
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
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
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
    const token = localStorage.getItem('token');

    if (!token) {
      this._authStatus.set(AuthStatus.notAuthenticated);
      return;
    }

    try {
      const isTokenValid = !this.jwtHelper.isTokenExpired(token);
      this._authStatus.set(isTokenValid ? AuthStatus.authenticated : AuthStatus.notAuthenticated);
    } catch (error) {
      console.error('Error al validar el token:', error);
      this._authStatus.set(AuthStatus.notAuthenticated);
    }
  }

  logout(){
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    this.router.navigate(['auth/login']);
  }

}
