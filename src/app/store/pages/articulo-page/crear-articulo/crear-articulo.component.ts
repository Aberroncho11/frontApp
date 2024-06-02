import { Component } from '@angular/core';
import { ArticuloPostDTO } from '../../../interfaces/articulo/articuloPostDTO.interface';
import { ArticuloServicio } from '../../../services/articulo.service';
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
  public articuloPostForm: FormGroup = this.fb.group({
    descripcion:    ['', [ Validators.required, Validators.minLength(20) ]],
    fabricante: ['', [ Validators.required, Validators.minLength(6) ]],
    peso: [0, [Validators.required]],
    altura: [0, [Validators.required]],
    ancho: [0, [Validators.required]],
    precio: [0, [Validators.required]],
    foto: [''],
  });

  public file: File | null = null;

  // CONSTRUCTOR
  constructor(private articuloServicio: ArticuloServicio,
    private fb: FormBuilder) {}


   // COGER ARTÍCULO DEL FORM
   get currentArticulo(): ArticuloPostDTO {

    const articulo = this.articuloPostForm.value as ArticuloPostDTO;
    return articulo;

  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  // CREAR ARTÍCULO
  crearArticulo(): void {

    if(this.articuloPostForm.invalid){
      this.articuloPostForm.markAllAsTouched();
      return;
    }

    this.articuloServicio.addArticulo(this.currentArticulo)
    .subscribe(response => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Artículo correctamente creado",
        showConfirmButton: false,
        timer: 1500
      });
      this.articuloPostForm.reset();
      this.articuloPostForm.patchValue({
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
    return this.articuloPostForm.controls[field].errors
    && this.articuloPostForm.controls[field].touched
  }

  // OBTENER ERROR DEL CAMPO
  getFieldError(field: string): string | null{
    if(!this.articuloPostForm.controls[field]) return null;

    const errors = this.articuloPostForm.controls[field].errors || {};

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