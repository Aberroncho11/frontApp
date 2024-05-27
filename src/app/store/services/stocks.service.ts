import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { StockDTO } from '../interfaces/stock/stockDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  addStock( stock: StockDTO): Observable<StockDTO>{
    return this.http.patch<StockDTO>(`${ this.baseUrl }/AddStock`, stock );
  }

}
