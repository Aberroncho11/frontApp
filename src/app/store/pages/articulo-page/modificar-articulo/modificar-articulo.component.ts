import { Component } from '@angular/core';
import { ArticuloServicio } from '../../../services/articulo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ArticuloDTO } from '../../../interfaces/articulo/articuloDTO.interface';
import { ArticuloPutDTO } from '../../../interfaces/articulo/articuloPutDTO.interface';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CustomValidators } from '../../../validators/validadores';

@Component({
  selector: 'modificar-articulo',
  templateUrl: './modificar-articulo.component.html',
  styleUrls: ['./modificar-articulo.component.css']
})
export class ModificarArticuloComponent {

  // VARIABLES
  // Formulario para el manejo de los artículos
  public articuloForm: FormGroup = this.fb.group({
    descripcion: ['', [ Validators.required, Validators.minLength(20) ]],
    fabricante: ['', [ Validators.required, Validators.minLength(6) ]],
    peso: [0, [Validators.required]],
    altura: [0, [Validators.required]],
    ancho: [0, [Validators.required]],
    precio: [0, [Validators.required]],
    estadoArticulo: ['', [Validators.required]],
    foto: ['']
  });

  // Formulario para el manejo del id del artículo
  public articuloIdForm: FormGroup = this.fb.group({
    idArticulo: [0, [ Validators.required ], CustomValidators.articuloExistente(this.articuloServicio)],
  });

  // Variable para el manejo de archivos
  public file: File | null = null;

  // Variable para el manejo del artículo
  public articulo: ArticuloDTO | null = null;

  // Variable para el manejo del id del artículo
  public idArticulo: number = 0;

  // CONSTRUCTOR
  constructor(private articuloServicio: ArticuloServicio, private fb: FormBuilder) {

    // Suscribirse a los cambios del campo idArticulo
    this.articuloIdForm.get('idArticulo')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();
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

  // Si el archivo cambia se guarda en la variable file
  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  // Metodo para obtener los artículos por id
  verArticulosPorId(): void {
    // Obtener el artículo por id
    this.articuloServicio.getArticuloPorId(this.idArticulo)
    .subscribe(articulo => {
      // Asignar el artículo obtenido
      this.articulo = articulo;
      // Si hay foto asignarla al formulario
      this.articuloForm.get('foto')?.setValue(articulo.foto);
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
    // Manejo de errores
    }, error => {
      console.error('Error al obtener el artículo:', error);
    });
  }

  // Metodo para modificar un artículo
  modificarArticulo(): void {
    // Si el formulario es inválido
    if(this.articuloForm.invalid){
      this.articuloForm.markAllAsTouched();
      return;
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
      // Reiniciar la variable de archivo
      const fotoControl = this.articuloForm.get('foto');
      if (fotoControl) {
        fotoControl.setValue(null);
      }
    // Manejo de errores
    }, error => {
      console.error('Error al crear artículo:', error);
    });
  }

  // Verificar si el campo es válido
  isValidFieldArticuloForm( field: string): boolean | null{

    return this.articuloForm.controls[field].errors
    && this.articuloForm.controls[field].touched
  }

  // Obtener error del campo
  getFieldErrorArticuloForm(field: string): string | null{
    // Si el campo no existe
    if(!this.articuloForm.controls[field]) return null;
    // Obtener los errores del campo
    const errors = this.articuloForm.controls[field].errors || {};
    // Recorrer los errores
    for (const key of Object.keys(errors)) {
      switch(key) {
        // Si el campo es requerido
        case 'required':
          return 'Este campo es requerido';
        // Si el campo es menor al mínimo
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
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
