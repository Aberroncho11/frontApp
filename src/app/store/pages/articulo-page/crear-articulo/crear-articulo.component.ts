import { Component, inject } from '@angular/core';
import { ArticuloPostDTO } from '../../../interfaces/articulo/articuloPostDTO.interface';
import { ArticuloServicio } from '../../../services/articulo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'crear-articulo',
  templateUrl: './crear-articulo.component.html',
  styleUrls: ['./crear-articulo.component.css']
})
export class CrearArticuloComponent {

  public articuloForm!: FormGroup;

  public file: File | null = null;

  private articuloServicio = inject(ArticuloServicio);

  private fb = inject(FormBuilder);

  /**
   * Método que inicializa el formulario de creación de artículos
   * @returns void
   * @memberof CrearArticuloComponent
   */
  ngOnInit(): void {
    this.articuloForm = this.fb.group({






      descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(50)]],
      fabricante: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      peso: ['', [Validators.required]],
      altura: ['', [Validators.required]],
      ancho: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      foto: [''],
    });

    const fieldsToWatch = ['descripcion', 'fabricante', 'peso', 'altura', 'ancho', 'precio'];

    fieldsToWatch.forEach(field => {
      this.articuloForm.get(field)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe(value => {
        console.log(`Field ${field} changed to:`, value);
      });
    });
  }

  /**
   * Método que obtiene el artículo actual
   * @returns ArticuloPostDTO
   * @memberof CrearArticuloComponent
   */
  get currentArticulo(): ArticuloPostDTO {

    const articulo = this.articuloForm.value as ArticuloPostDTO;

    if (this.file) {
      articulo.foto = this.file;
    }
    return articulo;
  }

  /**
   * Método que se ejecuta cuando se selecciona un archivo
   * @param event
   * @returns void
   * @memberof CrearArticuloComponent
   */
  onFileChange(event: any) {

    this.file = event.target.files[0];
  }

  /**
   * Método que crea un artículo
   * @returns void
   * @memberof CrearArticuloComponent
   */
  crearArticulo(): void {

    if (this.articuloForm.invalid) {
      this.articuloForm.markAllAsTouched();
      return;
    }
    this.articuloServicio.addArticulo(this.currentArticulo)
      .subscribe(response => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Artículo correctamente creado',
          showConfirmButton: false,
          timer: 1500
        });

        console.log(this.articuloForm.value)

        this.articuloForm.reset();

        this.articuloForm.reset({ peso: 0, altura: 0, ancho: 0, precio: 0 });

        const fileInput = document.getElementById('foto') as HTMLInputElement;

        if (fileInput) {
          fileInput.value = '';
        }

      }, error => {
        console.error('Error al crear artículo:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al crear el artículo",
        });
      });
  }

  /**
   * Método que valida si un campo es válido
   * @param field
   * @returns boolean | null
   * @memberof CrearArticuloComponent
   */
  isValidField(field: string): boolean | null {

    return this.articuloForm.controls[field].errors
    && this.articuloForm.controls[field].touched;
  }

  /**
   * Método que obtiene el error de un campo
   * @param field
   * @returns string | null
   * @memberof CrearArticuloComponent
   */
  getFieldError(field: string): string | null {

    if (!this.articuloForm.controls[field]) return null;

    const errors = this.articuloForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
   case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `La longitud mínima deber ser de ${errors['minlength'].requiredLength} caracteres`;
        case 'maxlength':
          return `La longitud máxima debe ser de ${errors['maxlength'].requiredLength} caracteres`;
      }
    }

    return null;
  }
}
