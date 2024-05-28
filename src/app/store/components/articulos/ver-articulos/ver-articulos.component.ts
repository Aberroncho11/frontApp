import { Component } from '@angular/core';
import { ArticleDTO } from '../../../interfaces/article/articleDTO.interface';
import { ArticleService } from '../../../services/articles.service';

@Component({
  selector: 'ver-articulos',
  templateUrl: './ver-articulos.component.html',
  styleUrls: ['./ver-articulos.component.css']
})
export class VerArticulosComponent {

  public articulos: ArticleDTO[] = [];

  constructor(private articleService: ArticleService) { }

  verArticulos(): void {
    this.articleService.getArticles()
    .subscribe( articulos => this.articulos = articulos);
  }

}
