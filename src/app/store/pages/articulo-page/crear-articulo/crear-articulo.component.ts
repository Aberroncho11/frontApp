import { Component } from '@angular/core';
import { ArticuloPostDTO } from '../../../interfaces/articulo/articuloPostDTO.interface';
import { ArticuloServicio } from '../../../services/articulo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'crear-articulo',
  templateUrl: './crear-articulo.component.html',
  styleUrls: ['./crear-articulo.component.css']
})
export class CrearArticuloComponent {

  // Formulario de form para crear un artículo
  public articuloPostForm: FormGroup = this.fb.group({
    descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(50)]],
    fabricante: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    peso: [0, [Validators.required]],
    altura: [0, [Validators.required]],
    ancho: [0, [Validators.required]],
    precio: [0, [Validators.required]],
    foto: [''],
  });

  // Fichero de foto
  public file: File | null = null;

  // Constructor
  constructor(private articuloServicio: ArticuloServicio, private fb: FormBuilder) {}

  // Obtenemos los datos del articulo del form y de la foto mediante el fichero
  get currentArticulo(): ArticuloPostDTO {
    const articulo = this.articuloPostForm.value as ArticuloPostDTO;
    // Si hay fichero se le mete la foto al campo foto del artículo
    if (this.file) {
      articulo.foto = this.file;
    }
    return articulo;
  }

  // Cuando el fichero cambie el fichero recoge la foto
  onFileChange(event: any) {

    this.file = event.target.files[0];
  }

  // Creación del artículo
  crearArticulo(): void {
    if (this.articuloPostForm.invalid) {
      // Si el formulario es inválido se marcan todos los campos como tocados
      this.articuloPostForm.markAllAsTouched();
      return;
    }
    // Se crea el artículo
    this.articuloServicio.addArticulo(this.currentArticulo)
      .subscribe(response => {
        // Mensaje de artículo creado correctamente
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Artículo correctamente creado',
          showConfirmButton: false,
          timer: 1500
        });

        //Reseteamos el formulario
        this.articuloPostForm.reset();

        this.articuloPostForm.reset({ peso: 0, altura: 0, ancho: 0, precio: 0 });

        const fileInput = document.getElementById('foto') as HTMLInputElement;

        if (fileInput) {
          fileInput.value = '';
        }

      }, error => {
        console.error('Error al crear artículo:', error);
        // Mensaje de error al crear artículo
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al crear el artículo",
        });
      });
  }

  // Comprobación de los campos del formulario
  isValidField(field: string): boolean | null {

    return this.articuloPostForm.controls[field].errors
    && this.articuloPostForm.controls[field].touched;
  }

  // Obtención del error y creación del mensaje
  getFieldError(field: string): string | null {

    if (!this.articuloPostForm.controls[field]) return null;

    const errors = this.articuloPostForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        // Requerido
        case 'required':
          return 'Este campo es requerido';
        // Miníma longitud
        case 'minlength':
          return `La longitud mínima deber ser de ${errors['minlength'].requiredLength} caracteres`;
        // Máxima longtiud
        case 'maxlength':
          return `La longitud máxima debe ser de ${errors['maxlength'].requiredLength} caracteres`;
      }
    }

    return null;
  }
}
