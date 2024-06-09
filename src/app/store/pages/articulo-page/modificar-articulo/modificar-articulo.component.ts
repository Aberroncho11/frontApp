import { Component, ElementRef, ViewChild } from '@angular/core';
import { ArticuloServicio } from '../../../services/articulo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ArticuloDTO } from '../../../interfaces/articulo/articuloDTO.interface';
import { ArticuloPutDTO } from '../../../interfaces/articulo/articuloPutDTO.interface';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CustomValidators } from '../../../../validators/validadores';

@Component({
  selector: 'modificar-articulo',
  templateUrl: './modificar-articulo.component.html',
  styleUrls: ['./modificar-articulo.component.css']
})
export class ModificarArticuloComponent {

  // Formulario de Articulo
  public articuloForm: FormGroup;

  // Formulario de Articulo por Id
  public articuloIdForm: FormGroup;

  // Variable para el manejo de archivos
  public file: File | null = null;

  // Variable para mostrar la foto solo después de modificar
  public mostrarFoto: boolean = false;

  public mostrarArticulo = false;

  // Variable para el manejo del artículo
  public articulo: ArticuloDTO | null = null;

  // Variable para la URL de vista previa de la imagen seleccionada
  public fotoPreviewUrl: string | null = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  // Variable para el manejo del id del artículo
  public idArticulo: number = 0;

  // CONSTRUCTOR
  constructor(private articuloServicio: ArticuloServicio, private fb: FormBuilder) {

    // Formulario para el manejo de los artículos
    this.articuloForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(50)]],
      fabricante: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      peso: ['', [Validators.required]],
      altura: ['', [Validators.required]],
      ancho: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      estadoArticulo: ['', [Validators.required, Validators.pattern('^(Disponible|Eliminado|Pendiente de eliminar)$')]],
      foto: ['']
    });

    // Formulario para el manejo del id del artículo
    this.articuloIdForm = this.fb.group({
    idArticulo: [0, [ Validators.required ], CustomValidators.articuloExistente(this.articuloServicio)],
    });

    this.articuloForm.get('descripcion')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();

    this.articuloForm.get('fabricante')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();

    this.articuloForm.get('peso')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();

    this.articuloForm.get('altura')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();

    this.articuloForm.get('ancho')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();

    this.articuloForm.get('precio')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();

    this.articuloForm.get('estadoArticulo')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();

      // Suscribirse a los cambios del campo idArticulo
    this.articuloIdForm.get('idArticulo')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();
  }

  // Si el archivo cambia se guarda en la variable file y se genera la URL de vista previa
  onFileChange(event: any) {
    // Asignar el archivo
    this.file = event.target.files[0];
    // Generar la URL de vista previa
  }

  // Recuperar articulo del formulario
  get currentArticulo(): ArticuloPutDTO {
    // Obtener el artículo del formulario
    const articulo = this.articuloForm.value as ArticuloPutDTO;
    // Si hay un archivo, asignarlo al artículo
    if (this.file) {
      articulo.foto = this.file;
    } else {
      delete articulo.foto;
    }
    return articulo;
  }

  // Metodo para obtener los artículos por id
  verArticulosPorId(): void {
    // Obtener el artículo por id
    this.articuloServicio.getArticuloPorId(this.idArticulo)
    .subscribe(articulo => {

      // Asignar el artículo obtenido
      this.articulo = articulo;

      // Cambiar los valores del formulario
      this.articuloForm.patchValue({
        descripcion: articulo.descripcion,
        fabricante: articulo.fabricante,
        peso: articulo.peso,
        altura: articulo.altura,
        ancho: articulo.ancho,
        precio: articulo.precio,
        estadoArticulo: articulo.estadoArticulo,
        foto: articulo.foto
      });

      // Mostrar la foto después de modificar
      if(articulo.foto == null){
        this.mostrarFoto = false;
      }
      else{
        this.mostrarFoto = true;
        this.file = articulo.foto;
      }

      this.mostrarArticulo = true;

    // Manejo de errores
    }, error => {
      console.error('Error al obtener el artículo:', error);
    });
  }

  // Metodo para modificar un artículo
  modificarArticulo(): void {
    // Si el formulario es inválido
    if (this.articuloForm.invalid) {
      this.articuloForm.markAllAsTouched();
      return;
    }
    // Obtener la foto actual del formulario
    const fotoActual = this.articuloForm.get('foto')?.value;
    // Si no se selecciona un nuevo archivo y hay una foto en el artículo actual
    if (!this.file && fotoActual) {
      // Asignar la foto actual al campo de la foto
      this.articuloForm.get('foto')?.setValue(fotoActual);
    }
    // Actualizar el artículo
    this.articuloServicio.updateArticulo(this.currentArticulo, this.idArticulo)
      .subscribe(response => {
        // Mostrar mensaje de éxito
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Artículo correctamente editado",
          showConfirmButton: false,
          timer: 1500
        });
        // Reiniciar el formulario
        this.articuloForm.reset({
          peso: 0,
          altura: 0,
          ancho: 0,
          precio: 0
        });

        this.idArticulo = 0;

        if (this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = '';
        }

        this.mostrarFoto = false;

        this.mostrarArticulo = false;

      // Manejo de errores
      }, error => {
        console.error('Error al crear artículo:', error);
      });
  }


  // Método para eliminar la foto del artículo
  eliminarFoto(): void {
    this.articuloForm.get('foto')?.setValue(null);
    this.file = null;
  }

  // Verificar si el campo es válido
  isValidFieldArticuloForm( field: string): boolean | null{

    return this.articuloForm.controls[field].errors
    && this.articuloForm.controls[field].touched
  }

  // Obtener error del campo
  getFieldErrorArticuloForm(field: string): string | null{
    if (!this.articuloForm.controls[field]) return null;
    const errors = this.articuloForm.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'maxlength':
          return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
        case 'pattern':
          return 'El estado debe ser Disponible, Eliminado o Pendiente de eliminar';
      }
    }

    return null;
  }

  // Verificar si el campo es válido
  isValidFieldArticuloIdForm( field: string): boolean | null{

    return this.articuloIdForm.controls[field].errors
    && this.articuloIdForm.controls[field].touched
  }

  // Obtener error del campo
  getFieldErrorArticuloIdForm(field: string): string | null{
    // Si el campo no existe
    if(!this.articuloIdForm?.get(field)) return null;
    // Obtener los errores del campo
    const errors = this.articuloIdForm.controls[field].errors || {};
    // Recorrer los errores
    if (field === 'idArticulo' && errors['articuloNotFound']) {
      return `No existe ningún artículo con ese id`;
    }

    return null;
  }

}
