import { Component } from '@angular/core';
import { ArticleCreacionDTO } from '../../../interfaces/article/articleCreacionDTO.interface';
import { ArticleService } from '../../../services/articles.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ArticleIdDTO } from '../../../interfaces/article/articleIdDTO.interface';
import { ArticlePutDTO } from '../../../interfaces/article/articlePutDTO.interface';
// import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'modificar-articulo',
  templateUrl: './modificar-articulo.component.html',
  styleUrls: ['./modificar-articulo.component.css']
})
export class ModificarArticuloComponent {

  // CREACIÓN DEL FORM PARA CREAR ARTÍCULO
  public articleForm: FormGroup = this.fb.group({
    description: ['', [ Validators.required, Validators.minLength(20) ]],
    maker: ['', [ Validators.required, Validators.minLength(6) ]],
    weight: [0, [Validators.required]],
    height: [0, [Validators.required]],
    width: [0, [Validators.required]],
    price: [0, [Validators.required]],
    status: ['', [Validators.required]],
    foto: ['']
  });

  public file: File | null = null;

  public articulo: ArticleIdDTO | null = null;

  public idArticulo: number = 0;

  // CONSTRUCTOR
  constructor(private articleService: ArticleService,
    private fb: FormBuilder) {}

  // COGER ARTÍCULO DEL FORM
  get currentArticle(): ArticlePutDTO {

    const article = this.articleForm.value as ArticlePutDTO;
    if (this.file) {
      article.foto = this.file;
    }
    return article;

  }

  onFileChange(event: any) {

    this.file = event.target.files[0];
  }

  // VER ARTÍCULO POR ID
  verArticulosPorId(): void {

    this.articleService.getArticlesPorId(this.idArticulo)
    .subscribe(articulo => {
      this.articulo = articulo;
      this.articleForm.patchValue({
        description: articulo.description,
        maker: articulo.maker,
        weight: articulo.weight,
        height: articulo.height,
        width: articulo.width,
        price: articulo.price,
        status: articulo.status,
        foto: articulo.foto
      });
    }, error => {
      console.error('Error al obtener el artículo:', error);
    });
  }

  // MODIFICAR ARTÍCULO
  modificarArticulo(): void {

    if(this.articleForm.invalid){
      this.articleForm.markAllAsTouched();
      return;
    }

    this.articleService.updateArticle(this.currentArticle, this.idArticulo)
    .subscribe(response => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Artículo correctamente editado",
        showConfirmButton: false,
        timer: 1500
      });

      this.articleForm.reset({
        weight: 0,
        height: 0,
        width: 0,
        price: 0
      });

      this.file = null;
      const fotoControl = this.articleForm.get('foto');
      if (fotoControl) {
        fotoControl.setValue(null);
      }
    }, error => {
      console.error('Error al crear artículo:', error);
    });
  }

  // VERIFICAR CAMPO VÁLIDO
  isValidField( field: string): boolean | null{

    return this.articleForm.controls[field].errors
    && this.articleForm.controls[field].touched
  }

  // OBTENER ERROR DEL CAMPO
  getFieldError(field: string): string | null{

    if(!this.articleForm.controls[field]) return null;

    const errors = this.articleForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch(key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
      }
    }

    return null;
  }

}
