import { Component } from '@angular/core';
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

  public mostrarTabla: boolean = false;

  public articulo: ArticleIdDTO | null = null;

  public idArticulo: number = 0;

  // CONSTRUCTOR
  constructor(private articleService: ArticleService) {}

  // VER ARTÍCULO POR ID
  verArticulosPorId(): void {
    this.articleService.getArticlesPorId(this.idArticulo).subscribe(
      articulo => {
        this.articulo = articulo;
        this.mostrarTabla = true;
      },
      error => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Usuario no encontrado",
          showConfirmButton: false,
          timer: 1500
        });
        this.mostrarTabla = false;
      }
    );
  }

  // ELIMINAR ARTÍCULO
  eliminarArticulo(): void {
    this.articleService.deleteArticle(this.idArticulo).subscribe(
      response => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Usuario eliminado correctamente",
          showConfirmButton: false,
          timer: 1500
        });
        this.idArticulo = 0;
        this.articulo = null;
        this.mostrarTabla = false;
      },
      error => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error al eliminar usuario",
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }

}
