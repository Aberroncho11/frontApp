import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
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

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  public articuloForm! : FormGroup;

  private articuloServicio = inject(ArticuloServicio);

  private fb = inject(FormBuilder);

  public file: File | null = null;

  // Inicializador
  ngOnInit() {

    this.articuloForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(50)]],
      fabricante: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      peso: ['', [Validators.required]],
      altura: ['', [Validators.required]],
      ancho: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      foto: [''],
    });

    const campos = ['nombre', 'descripcion', 'fabricante', 'peso', 'altura', 'ancho', 'precio'];

    campos.forEach(campo => {

      this.articuloForm.get(campo)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe();

    });
  }

  // Getters
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
   * Método que se encarga de cambiar el valor de la variable file
   * @param event
   * @returns void
   * @memberof CrearArticuloComponent
   */
  onFileChange(event: any) {

    this.file = event.target.files[0];
  }

  /**
   * Método que se encarga de crear un artículo
   * @returns void
   * @memberof CrearArticuloComponent
   */
  crearArticulo(): void {

    if (this.articuloForm.invalid) {
      this.articuloForm.markAllAsTouched();
      return;
    }

    console.log(this.currentArticulo)

    this.articuloServicio.addArticulo(this.currentArticulo)
      .subscribe(response => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Artículo correctamente creado',
          showConfirmButton: false,
          timer: 1500
        });

        this.articuloForm.reset();

        if (this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = '';
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
   * Método que se encarga de validar un campo
   * @param field
   * @returns boolean | null
   * @memberof CrearArticuloComponent
   */
  isValidField(field: string): boolean | null {

    return this.articuloForm.controls[field].errors
    && this.articuloForm.controls[field].touched;
  }

  /**
   * Método que se encarga de obtener el error de un campo
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
