import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/articles.service';
import { ArticleIdDTO } from '../../../interfaces/article/articleIdDTO.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'eliminar-articulo',
  templateUrl: './eliminar-articulo.component.html',
  styleUrls: ['./eliminar-articulo.component.css']
})
export class EliminarArticuloComponent {

  public file: File | null = null;

  public articulo: ArticleIdDTO | null = null;

  public idArticulo: number = 0;

  // CONSTRUCTOR
  constructor(private articleService: ArticleService) {}

  // VER ARTÍCULO POR ID
  verArticulosPorId(): void {
    this.articleService.getArticlesPorId(this.idArticulo)
    .subscribe(articulo => this.articulo = articulo )
  }

  // ELIMINAR ARTÍCULO
  eliminarArticulo():void{
    this.articleService.deleteArticle(this.idArticulo)
    .subscribe(response => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Artículo eliminado correctamente",
        showConfirmButton: false,
        timer: 1500
      });
  });
  }

}
