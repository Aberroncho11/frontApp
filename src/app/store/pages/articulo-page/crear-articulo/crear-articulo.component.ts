<<<<<<< HEAD
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
=======
import { Component, inject } from '@angular/core';
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
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
export class CrearArticuloComponent implements OnInit{

<<<<<<< HEAD
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  public articuloForm! : FormGroup;

  private articuloServicio = inject(ArticuloServicio);

  private fb = inject(FormBuilder);

  public file: File | null = null;

  // Inicializador
  ngOnInit() {

    this.articuloForm = this.fb.group({
=======
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






>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
      descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(50)]],
      fabricante: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      peso: ['', [Validators.required]],
      altura: ['', [Validators.required]],
      ancho: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      foto: [''],
    });

<<<<<<< HEAD
    const campos = ['descripcion', 'fabricante', 'peso', 'altura', 'ancho', 'precio'];

    campos.forEach(campo => {

      this.articuloForm.get(campo)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe();

    });
  }

  // Getters
=======
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
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
  get currentArticulo(): ArticuloPostDTO {

    const articulo = this.articuloForm.value as ArticuloPostDTO;

    if (this.file) {
      articulo.foto = this.file;
    } else {
      delete articulo.foto;
    }

    return articulo;
  }

  /**
<<<<<<< HEAD
   * Método que se encarga de cambiar el valor de la variable file
=======
   * Método que se ejecuta cuando se selecciona un archivo
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
   * @param event
   * @returns void
   * @memberof CrearArticuloComponent
   */
  onFileChange(event: any) {

    this.file = event.target.files[0];
  }

  /**
<<<<<<< HEAD
   * Método que se encarga de crear un artículo
=======
   * Método que crea un artículo
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
   * @returns void
   * @memberof CrearArticuloComponent
   */
  crearArticulo(): void {

    if (this.articuloForm.invalid) {
      this.articuloForm.markAllAsTouched();
      return;
    }
<<<<<<< HEAD

=======
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
    this.articuloServicio.addArticulo(this.currentArticulo)
      .subscribe(response => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Artículo correctamente creado',
          showConfirmButton: false,
          timer: 1500
        });

<<<<<<< HEAD
        this.articuloForm.reset();

        if (this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = '';
=======
        console.log(this.articuloForm.value)

        this.articuloForm.reset();

        this.articuloForm.reset({ peso: 0, altura: 0, ancho: 0, precio: 0 });

        const fileInput = document.getElementById('foto') as HTMLInputElement;

        if (fileInput) {
          fileInput.value = '';
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
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
<<<<<<< HEAD
   * Método que se encarga de validar un campo
=======
   * Método que valida si un campo es válido
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
   * @param field
   * @returns boolean | null
   * @memberof CrearArticuloComponent
   */
  isValidField(field: string): boolean | null {

    return this.articuloForm.controls[field].errors
    && this.articuloForm.controls[field].touched;
  }

  /**
<<<<<<< HEAD
   * Método que se encarga de obtener el error de un campo
=======
   * Método que obtiene el error de un campo
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
   * @param field
   * @returns string | null
   * @memberof CrearArticuloComponent
   */
  getFieldError(field: string): string | null {

    if (!this.articuloForm.controls[field]) return null;

    const errors = this.articuloForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
<<<<<<< HEAD
        case 'required':
=======
   case 'required':
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
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
