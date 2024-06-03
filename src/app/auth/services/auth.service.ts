import { HttpClient } from '@angular/common/http';
import { Injectable, inject, computed, signal} from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { AuthStatus, LoginResponse, User } from '../interfaces';
import { environment } from '../../environments/environments';
import { JwtHelperService } from '@auth0/angular-jwt';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private jwtHelper: JwtHelperService

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //! Al mundo exterior
  public currentUser = computed( () => this._currentUser() )
  public authStatus = computed( () => this._authStatus() )

  constructor() {
    this.jwtHelper = new JwtHelperService();
    this.checkAuthStatus();
   }

  private setAuthentication(user: User, token: string): boolean {

    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  login( email: string, password: string): Observable<boolean> {

    const url = `${this.baseUrl}/login`;
    const body = { email, password };


    return this.http.post<LoginResponse>(url, body)
    .pipe(
      map( ({user, token}) =>
        this.setAuthentication(user, token)),
      //Todo: errores
      catchError( err => throwError( () => err.error.message)
      )
    );
  }

  getRoleFromToken(): string | null{
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    } else {
      return null;
    }
  }

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
  }

}
