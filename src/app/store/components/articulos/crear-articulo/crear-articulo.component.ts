import { Component } from '@angular/core';
import { ArticleCreacionDTO } from '../../../interfaces/article/articleCreacionDTO.interface';
import { ArticleService } from '../../../services/articles.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
// import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'crear-articulo',
  templateUrl: './crear-articulo.component.html',
  styleUrls: ['./crear-articulo.component.css']
})
export class CrearArticuloComponent {

  // CREACIÓN DEL FORM PARA CREAR ARTÍCULO
  public articlePostForm: FormGroup = this.fb.group({
    description:    ['', [ Validators.required, Validators.minLength(20) ]],
    maker: ['', [ Validators.required, Validators.minLength(6) ]],
    weight: [0, [Validators.required]],
    height: [0, [Validators.required]],
    width: [0, [Validators.required]],
    price: [0, [Validators.required]],
    foto: [''],
  });

  public file: File | null = null;

  // CONSTRUCTOR
  constructor(private articleService: ArticleService,
    private fb: FormBuilder) {}


   // COGER ARTÍCULO DEL FORM
   get currentArticle(): ArticleCreacionDTO {

    const article = this.articlePostForm.value as ArticleCreacionDTO;
    return article;

  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  // CREAR ARTÍCULO
  crearArticulo(): void {

    if(this.articlePostForm.invalid){
      this.articlePostForm.markAllAsTouched();
      return;
    }

    this.articleService.addArticle(this.currentArticle)
    .subscribe(response => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Artículo correctamente creado",
        showConfirmButton: false,
        timer: 1500
      });
      this.articlePostForm.reset();
      this.articlePostForm.patchValue({
        weight: 0,
        height: 0,
        width: 0,
        price: 0
      });

      this.file = null;
      const fileInput = document.getElementById('foto') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }, error => {
      console.error('Error al crear artículo:', error);
    });
  }

  // VERIFICAR CAMPO VÁLIDO
  isValidField( field: string): boolean | null{
    return this.articlePostForm.controls[field].errors
    && this.articlePostForm.controls[field].touched
  }

  // OBTENER ERROR DEL CAMPO
  getFieldError(field: string): string | null{
    if(!this.articlePostForm.controls[field]) return null;

    const errors = this.articlePostForm.controls[field].errors || {};

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
