import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
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
export class ModificarArticuloComponent implements OnInit{

<<<<<<< HEAD
  private fb = inject(FormBuilder);

  private articuloServicio = inject(ArticuloServicio);

  public articuloForm!: FormGroup;

  public articuloIdForm!: FormGroup;
=======
  // Formulario de Articulo
  public articuloForm: FormGroup;

  // Formulario de Articulo por Id
  public articuloIdForm: FormGroup;
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b

  public file: File | null = null;

  public mostrarFoto: boolean = false;

  public mostrarArticulo = false;

<<<<<<< HEAD
=======
  // Variable para el manejo del artículo
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
  public articulo: ArticuloDTO | null = null;

  // Variable para la URL de vista previa de la imagen seleccionada
  public fotoPreviewUrl: string | null = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  public fotoBorrar: string | undefined;

  // Inicialización
  ngOnInit() {

    this.articuloForm = this.fb.group({
      descripcion: ['', [ Validators.required, Validators.minLength(20), Validators.maxLength(50) ]],
      fabricante: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(20) ]],
      peso: ['', [Validators.required]],
      altura: ['', [Validators.required]],
      ancho: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      estadoArticulo: ['', [Validators.required]],
      foto: ['']
    });

    this.articuloIdForm = this.fb.group({
      idArticulo: ['', [ Validators.required ], CustomValidators.articuloExistente(this.articuloServicio)],
    });

    const campos = ['descripcion', 'fabricante', 'peso', 'altura', 'ancho', 'precio', 'estadoArticulo'];

    campos.forEach(campo => {

      this.articuloForm.get(campo)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe();

    });

<<<<<<< HEAD
=======
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
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
    this.articuloIdForm.get('idArticulo')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();
  }

<<<<<<< HEAD
  // Getters
=======
  // Si el archivo cambia se guarda en la variable file y se genera la URL de vista previa
  onFileChange(event: any) {
    // Asignar el archivo
    this.file = event.target.files[0];
    // Generar la URL de vista previa
  }

  // Recuperar articulo del formulario
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
  get currentArticulo(): ArticuloPutDTO {

    const articulo = this.articuloForm.value as ArticuloPutDTO;

    if (this.file) {
      articulo.foto = this.file;
    } else {
      delete articulo.foto;
    }

    return articulo;
  }

<<<<<<< HEAD
  /**
   * Cuando el archivo cambia se carga en la variable file el nuevo archivo
   * @param event
   */
  onFileChange(event: any) {

    this.file = event.target.files[0];
  }

  /**
   * Método que se encarga de buscar un artículo por su id
   * @param idArticulo
   */
  verArticulosPorId(): void {

    this.articuloServicio.getArticuloPorId(this.articuloIdForm.get('idArticulo')?.value)
    .subscribe({
      next: (articulo) => {
=======
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
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b


        this.articulo = articulo;

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

        this.fotoBorrar = articulo.foto;

        if(articulo.foto == null){
          this.mostrarFoto = false;
        }
        else{
          this.mostrarFoto = true;
        }

        this.mostrarArticulo = true;

      },
      error: (error) => {
        console.error('Error al obtener el artículo:', error);
      }
    });
  }

  /**
   * Método que se encarga de modificar un artículo
   * @returns void
   * @memberof ModificarArticuloComponent
   */
  modificarArticulo(): void {

    if (this.articuloForm.invalid) {
      this.articuloForm.markAllAsTouched();
      return;
    }

    this.articuloServicio.updateArticulo(this.currentArticulo, this.articuloIdForm.get('idArticulo')?.value)
      .subscribe(response => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Artículo correctamente editado",
          showConfirmButton: false,
          timer: 1500
        });

        this.articuloForm.reset();

        this.articuloIdForm.reset();

        if (this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = '';
        }

        this.mostrarFoto = false;

        this.mostrarArticulo = false;

<<<<<<< HEAD
=======
      // Manejo de errores
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
      }, error => {
        console.error('Error al crear artículo:', error);
      });
  }


  /**
   * Método que se encarga de eliminar una foto
   * @returns void
   * @memberof ModificarArticuloComponent
   */
  eliminarFoto(): void {
<<<<<<< HEAD

    if (this.fotoBorrar) {

      const filename = this.fotoBorrar.substring(this.fotoBorrar.lastIndexOf('/') + 1);

      this.articuloServicio.borrarFoto(filename).subscribe({
        next: (response) => {
          console.log('Foto borrada exitosamente:', response);
          this.articuloForm.get('foto')?.setValue(null);
          this.file = null;
          this.mostrarFoto = false;
        },
        error: (err) => {
          console.error('Error al borrar la foto:', err);
        }
      });
    } else {
      console.error('No hay foto seleccionada para borrar');
    }
=======
    this.articuloForm.get('foto')?.setValue(null);
    this.file = null;
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
  }

  /**
   * Método que se encarga de verificar si un campo es válido
   * @param field
   * @returns boolean | null
   * @memberof ModificarArticuloComponent
   */
  isValidFieldArticuloForm( field: string): boolean | null{

    return this.articuloForm.controls[field].errors
    && this.articuloForm.controls[field].touched
  }

  /**
   * Método que se encarga de obtener el error de un campo
   * @param field
   * @returns string | null
   * @memberof ModificarArticuloComponent
   */
  getFieldErrorArticuloForm(field: string): string | null{
<<<<<<< HEAD

    if(!this.articuloForm.controls[field]) return null;

    const errors = this.articuloForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch(key) {
=======
    if (!this.articuloForm.controls[field]) return null;
    const errors = this.articuloForm.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'maxlength':
<<<<<<< HEAD
          return `La longitud máxima debe ser de ${errors['maxlength'].requiredLength} caracteres`;
=======
          return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
        case 'pattern':
          return 'El estado debe ser Disponible, Eliminado o Pendiente de eliminar';
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
      }
    }

    return null;
  }

  /**
   * Método que se encarga de verificar si un campo es válido
   * @param field
   * @returns boolean | null
   * @memberof ModificarArticuloComponent
   */
  isValidFieldArticuloIdForm( field: string ): boolean | null{

    return this.articuloIdForm.controls[field].errors
    && this.articuloIdForm.controls[field].touched
  }

  /**
   * Método que se encarga de obtener el error de un campo
   * @param field
   * @returns
   * @memberof ModificarArticuloComponent
   */
  getFieldErrorArticuloIdForm(field: string): string | null{

    if(!this.articuloIdForm?.get(field)) return null;

    const errors = this.articuloIdForm.controls[field].errors || {};

    if (field === 'idArticulo' && errors['articuloNotFound']) {
      return `No existe ningún artículo con ese id`;
    }

    return null;
  }

}
