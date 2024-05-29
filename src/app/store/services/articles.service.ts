import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { ArticleDTO } from '../interfaces/article/articleDTO.interface';
import { ArticleCreacionDTO } from '../interfaces/article/articleCreacionDTO.interface';
import { ArticleIdDTO } from '../interfaces/article/articleIdDTO.interface';
import { ArticlePutDTO } from '../interfaces/article/articlePutDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getArticles():Observable<ArticleDTO[]> {

    return this.http.get<ArticleDTO[]>(`${ this.baseUrl }/verArticulos`);
  }

  getArticlesPorId(idArticle: number):Observable<ArticleIdDTO> {

    return this.http.get<ArticleIdDTO>(`${this.baseUrl}/verArticulosPorId/${idArticle}`);
  }

  addArticle( article: ArticleCreacionDTO): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('Description', article.description);
    formData.append('Maker', article.maker);
    formData.append('Weight', article.weight.toString());
    formData.append('Height', article.height.toString());
    formData.append('Width', article.width.toString());
    formData.append('Price', article.price.toString());
    if (article.foto) {
      formData.append('Foto', article.foto, article.foto.name);
    }

    return this.http.post<any>(`${ this.baseUrl }/crearArticulo`, formData );
  }

  updateArticle( article: ArticlePutDTO, idArticle: number ): Observable<ArticlePutDTO> {

    const formData: FormData = new FormData();
    formData.append('Description', article.description);
    formData.append('Maker', article.maker);
    formData.append('Weight', article.weight.toString());
    formData.append('Height', article.height.toString());
    formData.append('Width', article.width.toString());
    formData.append('Price', article.price.toString());
    formData.append('Status', article.status.toString());
    if (article.foto) {
      formData.append('Foto', article.foto, article.foto.name);
    }

    return this.http.put<ArticlePutDTO>(`${ this.baseUrl }/modificarArticulo/${ idArticle }`, formData );
  }

  deleteArticle( idArticle: number ): Observable<boolean> {

    return this.http.delete(`${ this.baseUrl }/eliminarArticulo/${ idArticle }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }
}
