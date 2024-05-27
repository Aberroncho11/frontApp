import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, computed, signal} from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';
import { environment } from '../../environments/environments';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //! Al mundo exterior
  public currentUser = computed( () => this._currentUser() )
  public authStatus = computed( () => this._authStatus() )

  constructor() {
    // this.checkAuthStatus().subscribe();
   }

  private setAuthentication(user: User, token: string): boolean {

    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  login( email: string, password: string): Observable<boolean> {

<<<<<<< HEAD
    const url = `${this.baseUrl}/login`;
    const body = { email, password};
=======
    const url = `${this.baseUrl}/Login`;
    const body = { email, password };
>>>>>>> 59b1aa5a8531a6d4723640726cdc489bae39059b

    return this.http.post<LoginResponse>(url, body)
    .pipe(
      map( ({user, token}) =>
        this.setAuthentication(user, token)),
      //Todo: errores
      catchError( err => throwError( () => err.error.message)
      )
    );
  }

<<<<<<< HEAD
  // checkAuthStatus(): Observable<boolean>{
  //   const url = `${this.baseUrl}/checkToken`;
  //   const token = localStorage.getItem('token');
=======
  checkAuthStatus(): Observable<boolean>{
    const url = `${this.baseUrl}/CheckToken`;
    const token = localStorage.getItem('token');
>>>>>>> 59b1aa5a8531a6d4723640726cdc489bae39059b

  //   if(!token){
  //     this.logout();
  //     return of(false);
  //   }

  //   const headers = new HttpHeaders()
  //   .set('Authorization', `Bearer ${token}`);

<<<<<<< HEAD
  //   return this.http.get<CheckTokenResponse>(url, {headers: headers})
  //   .pipe(
  //     map( ({token, user}) => this.setAuthentication(user, token)),
  //     //error
  //     catchError(() => {
  //       this._authStatus.set(AuthStatus.notAuthenticated);
  //       return of(false);
  //     })
  //   )
  // }
=======

    return this.http.get<CheckTokenResponse>(url, {headers: headers})
    .pipe(
      map( ({user, token}) => this.setAuthentication(user, token)),
      //error
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    )
  }
>>>>>>> 59b1aa5a8531a6d4723640726cdc489bae39059b

  logout(){
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated)
  }

}
