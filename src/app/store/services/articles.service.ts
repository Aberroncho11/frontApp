import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { ArticleDTO } from '../interfaces/article/articleDTO.interface';
import { ArticleCreacionDTO } from '../interfaces/article/articleCreacionDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getArticles():Observable<ArticleDTO[]> {
<<<<<<< HEAD
    return this.http.get<ArticleDTO[]>(`${ this.baseUrl }/verArticulos`);
  }

  addArticle( article: ArticleCreacionDTO ): Observable<ArticleCreacionDTO> {
    return this.http.post<ArticleCreacionDTO>(`${ this.baseUrl }/crearArticulo`, article );
  }

  updateArticle( article: ArticleCreacionDTO, idArticle: number ): Observable<ArticleCreacionDTO> {
    return this.http.put<ArticleCreacionDTO>(`${ this.baseUrl }/modificarArticulo/${ idArticle }`, article );
  }

  deleteArticle( idArticle: number ): Observable<boolean> {
    return this.http.delete(`${ this.baseUrl }/eliminarArticulos/${ idArticle }`)
=======
    return this.http.get<ArticleDTO[]>(`${ this.baseUrl }/VerArticulos`);
  }

  addArticle( article: ArticleCreacionDTO ): Observable<ArticleCreacionDTO> {
    return this.http.post<ArticleCreacionDTO>(`${ this.baseUrl }/CrearArticulos`, article );
  }

  updateArticle( article: ArticleCreacionDTO, idArticle: number ): Observable<ArticleCreacionDTO> {
    return this.http.put<ArticleCreacionDTO>(`${ this.baseUrl }/ModificarArticulos/${ idArticle }`, article );
  }

  deleteArticle( idArticle: number ): Observable<boolean> {
    return this.http.delete(`${ this.baseUrl }/EliminarArticulos/${ idArticle }`)
>>>>>>> 59b1aa5a8531a6d4723640726cdc489bae39059b
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }
}
