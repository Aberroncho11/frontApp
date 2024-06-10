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

  private fb = inject(FormBuilder);

  private articuloServicio = inject(ArticuloServicio);

  public articuloForm!: FormGroup;

  public articuloIdForm!: FormGroup;

  public file: File | null = null;

  public mostrarFoto: boolean = false;

  public mostrarArticulo = false;

  public articulo: ArticuloDTO | null = null;

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

    this.articuloIdForm.get('idArticulo')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();
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
