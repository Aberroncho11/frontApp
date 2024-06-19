import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ArticuloServicio } from '../../../services/articulo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ArticuloDTO } from '../../../interfaces/articulo/articuloDTO.interface';
import { ArticuloPutDTO } from '../../../interfaces/articulo/articuloPutDTO.interface';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CustomValidators } from '../../../../validators/validadores';
import { AlmacenDTO } from '../../../interfaces/almacen/almacenDTO.interface';

@Component({
  selector: 'modificar-articulo',
  templateUrl: './modificar-articulo.component.html',
  styleUrls: ['./modificar-articulo.component.css']
})
export class ModificarArticuloComponent implements OnInit{

  private fb = inject(FormBuilder);

  private articuloServicio = inject(ArticuloServicio);

  public articuloForm!: FormGroup;

  public articuloNombreForm!: FormGroup;

  public almacenForm!: FormGroup;

  public file: File | null = null;

  public mostrarFoto: boolean = false;

  public mostrarArticulo = false;

  public articulo: ArticuloDTO | null = null;

  public articulosLista: ArticuloDTO[] = [];

  public estadoEliminado: boolean = false;

  public estadoPendiente: boolean = false;

  public nombre: string = '';

  public estanteriasLista: AlmacenDTO[] = [];

  public addArticuloAlmacen: boolean = false;

  public isLoading = true;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  public fotoBorrar: string | undefined;

  // Inicialización
  ngOnInit() {

    this.estadoEliminado = false;

    this.estadoPendiente = false;

    setTimeout(() => {
      document.querySelector('.loading-overlay')?.classList.add('hidden');
      }, 500);

    this.articuloForm = this.fb.group({
      nombre: ['', [ Validators.required, Validators.minLength(4), Validators.maxLength(20), Validators.pattern(/^(?!.* {2,}).*$/)]],
      descripcion: ['', [ Validators.required, Validators.minLength(20), Validators.maxLength(50), Validators.pattern(/^(?!.* {2,}).*$/) ]],
      fabricante: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern(/^(?!.* {2,}).*$/) ]],
      peso: ['', [Validators.required]],
      altura: ['', [Validators.required]],
      ancho: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      estadoArticulo: ['', [Validators.required]],
      idEstanteria: [''],
      cantidad: [''],
      foto: ['']
    });

    this.articuloNombreForm = this.fb.group({
      nombre: ['', [ Validators.required ]],
    });

    this.almacenForm = this.fb.group({
      idEstanteria: [''],
      cantidad: ['']
    });

    const campos = ['nombre', 'descripcion', 'fabricante', 'peso', 'altura', 'ancho', 'precio', 'estadoArticulo', 'idEstanteria', 'cantidad'];

    campos.forEach(campo => {

      this.articuloForm.get(campo)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe();

    });

    this.articuloNombreForm.get('nombre')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();

    const camposAlmacen = ['idEstanteria', 'cantidad'];

    camposAlmacen.forEach(campo => {

      this.articuloForm.get(campo)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe();

    });


    this.articuloServicio.getArticulos()
    .subscribe({
      next: (articulos: ArticuloDTO[]) => {
        this.articulosLista = articulos;
      },
      error: (error) => {
        console.error('Error al obtener los artículos:', error);
      }
    });
  }

  // Getters
  get currentArticulo(): ArticuloPutDTO {

    const articulo = this.articuloForm.value as ArticuloPutDTO;

    if (this.file) {
      articulo.foto = this.file;
    } else {
      delete articulo.foto;
    }

    return articulo;
  }

  get currentAlmacen(): AlmacenDTO | null {

    var almacen: AlmacenDTO | null;

    if(this.estadoEliminado){
      almacen = this.almacenForm.value as AlmacenDTO;
    }else{
      almacen = null;
    }

    return almacen;
  }

  /**
   * Cuando el archivo cambia se carga en la variable file el nuevo archivo
   * @param event
   */
  onFileChange(event: any) {

    this.file = event.target.files[0];
  }

  onValueChangeEstado(event: any) {
    if(event.target.value == 'Disponible' && this.estadoEliminado){

      this.articuloServicio.getEstanteriasVacias()
      .subscribe({
        next: (estanterias: AlmacenDTO[]) => {
          this.estanteriasLista = estanterias;
        },
        error: (error) => {
          console.error('Error al obtener las estanterias:', error);
        }
      });

      this.almacenForm.get('idEstanteria')?.setValidators(Validators.required);

      this.almacenForm.get('cantidad')?.setValidators([Validators.required, Validators.min(1)]);

      this.almacenForm.get('idEstanteria')?.updateValueAndValidity();

      this.almacenForm.get('cantidad')?.updateValueAndValidity();

      this.addArticuloAlmacen = true;
    }
    else{
      this.addArticuloAlmacen = false;

      this.almacenForm.get('idEstanteria')?.clearValidators();

      this.almacenForm.get('cantidad')?.clearValidators();

      this.almacenForm.get('idEstanteria')?.updateValueAndValidity();

      this.almacenForm.get('cantidad')?.updateValueAndValidity();
      this.almacenForm.reset();
    }
  }

  /**
   * Método que se encarga de buscar un artículo por su id
   * @param idArticulo
   */
  verArticulosPorNombre(): void {

    this.addArticuloAlmacen = false;

    this.articuloServicio.getArticuloPorNombre(this.articuloNombreForm.get('nombre')?.value)
    .subscribe({
      next: (articulo) => {

        this.estadoEliminado = false;

        this.estadoPendiente = false;

        this.articulo = articulo;

        this.articuloForm.patchValue({
          descripcion: articulo.descripcion,
          nombre: articulo.nombre,
          fabricante: articulo.fabricante,
          peso: articulo.peso,
          altura: articulo.altura,
          ancho: articulo.ancho,
          precio: articulo.precio,
          estadoArticulo: articulo.estadoArticulo,
          foto: articulo.foto
        });

        this.articuloForm.get('estadoArticulo')?.setValue(articulo.estadoArticulo);

        if(articulo.estadoArticulo == 'Eliminado'){
          this.estadoEliminado = true;
        }
        else if(articulo.estadoArticulo == 'Pendiente de eliminar'){
          this.estadoPendiente = true;
        }

        this.fotoBorrar = articulo.foto;

        if(articulo.foto == null){
          this.mostrarFoto = false;
        }
        else{
          this.mostrarFoto = true;
        }

        this.mostrarArticulo = true;

        this.nombre = articulo.nombre;

      },
      error: (error) => {
        console.error('Error al obtener el artículo:', error);
      }
    });
  }

  /**
   * Método que se encarga de modificar un artículo
   * @memberof ModificarArticuloComponent
   */
  modificarArticulo(): void {

    if (this.articuloForm.invalid) {
      this.articuloForm.markAllAsTouched();
      return;
    }

    if(this.articuloServicio.checkNombre(this.currentArticulo.nombre) && this.currentArticulo.nombre != this.nombre){
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Ya existe un artículo con ese nombre",
        showConfirmButton: false,
        timer: 1500
      });
    }
    else{
      this.articuloServicio.updateArticulo(this.currentArticulo, this.currentAlmacen, this.articuloNombreForm.get('nombre')?.value)
    .subscribe({
      next: () => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Artículo correctamente editado",
          showConfirmButton: false,
          timer: 1500
        });

        this.articuloForm.reset();

        this.articuloNombreForm.reset();

        if (this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = '';
        }

        this.articuloNombreForm.get('nombre')?.setValue('');

        this.mostrarFoto = false;

        this.mostrarArticulo = false;

        this.articuloServicio.getArticulos()
        .subscribe({
          next: (articulos: ArticuloDTO[]) => {
            this.articulosLista = articulos;
          },
          error: (error) => {
            console.error('Error al obtener los artículos:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al crear artículo:', error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error al modificar artículo",
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
    }

  }


  /**
   * Método que se encarga de eliminar una foto
   * @memberof ModificarArticuloComponent
   */
  eliminarFoto(): void {

    if (this.fotoBorrar) {

      const filename = this.fotoBorrar.substring(this.fotoBorrar.lastIndexOf('/') + 1);

      this.articuloServicio.borrarFoto(filename).subscribe({
        next: () => {

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

    if(!this.articuloForm.controls[field]) return null;

    const errors = this.articuloForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch(key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'maxlength':
          return `La longitud máxima debe ser de ${errors['maxlength'].requiredLength} caracteres`;
        case 'pattern':
          return 'No se permiten espacios en blanco consecutivos';

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
  isValidFieldArticuloNombreForm( field: string ): boolean | null{

    return this.articuloNombreForm.controls[field].errors
    && this.articuloNombreForm.controls[field].touched
  }

  /**
   * Método que se encarga de obtener el error de un campo
   * @param field
   * @returns
   * @memberof ModificarArticuloComponent
   */
  getFieldErrorArticuloNombreForm(field: string): string | null{

    if(!this.articuloNombreForm.get(field)) return null;

    const errors = this.articuloNombreForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch(key) {
        case 'required':
          return 'Este campo es requerido';
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
  isValidFieldAlmacenForm( field: string ): boolean | null{

    return this.almacenForm.controls[field].errors
    && this.almacenForm.controls[field].touched
  }

  /**
   * Método que se encarga de obtener el error de un campo
   * @param field
   * @returns
   * @memberof ModificarArticuloComponent
   */
  getFieldErrorAlmacenForm(field: string): string | null{

    if(!this.almacenForm.get(field)) return null;

    const errors = this.almacenForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch(key) {
        case 'required':
          return 'Este campo es requerido';
        case 'min':
          return 'Debe ser mayor que 0';
      }
    }

    return null;
  }

}
