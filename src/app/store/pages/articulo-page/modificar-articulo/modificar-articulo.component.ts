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

  // CREACIÓN DEL FORM PARA CREAR ARTÍCULO
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

  public articuloIdForm: FormGroup = this.fb.group({
    idArticulo: [0, [ Validators.required ], CustomValidators.articuloExistente(this.articuloServicio)],
  });

  public file: File | null = null;

  public articulo: ArticuloDTO | null = null;

  public idArticulo: number = 0;

  // CONSTRUCTOR
  constructor(private articuloServicio: ArticuloServicio, private fb: FormBuilder) {

    this.articuloIdForm.get('idArticulo')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();
  }

  // COGER ARTÍCULO DEL FORM
  get currentArticulo(): ArticuloPutDTO {
    const articulo = this.articuloForm.value as ArticuloPutDTO;
    if (this.file) {
      articulo.foto = this.file;
    } else {
      delete articulo.foto;
    }
    return articulo;
  }


  onFileChange(event: any) {

    this.file = event.target.files[0];
  }

  // VER ARTÍCULO POR ID
  verArticulosPorId(): void {

    this.articuloServicio.getArticuloPorId(this.idArticulo)
    .subscribe(articulo => {
      this.articulo = articulo;

      this.articuloForm.get('foto')?.setValue(articulo.foto);

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

    }, error => {
      console.error('Error al obtener el artículo:', error);
    });
  }

  // MODIFICAR ARTÍCULO
  modificarArticulo(): void {

    if(this.articuloForm.invalid){
      this.articuloForm.markAllAsTouched();
      return;
    }
    console.log(this.currentArticulo);
    this.articuloServicio.updateArticulo(this.currentArticulo, this.idArticulo)
    .subscribe(response => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Artículo correctamente editado",
        showConfirmButton: false,
        timer: 1500
      });

      this.articuloForm.reset({
        peso: 0,
        altura: 0,
        ancho: 0,
        precio: 0
      });

      this.file = null;
      const fotoControl = this.articuloForm.get('foto');
      if (fotoControl) {
        fotoControl.setValue(null);
      }
    }, error => {
      console.error('Error al crear artículo:', error);
    });
  }

  // VERIFICAR CAMPO VÁLIDO
  isValidFieldArticuloForm( field: string): boolean | null{

    return this.articuloForm.controls[field].errors
    && this.articuloForm.controls[field].touched
  }

  // OBTENER ERROR DEL CAMPO
  getFieldErrorArticuloForm(field: string): string | null{

    if(!this.articuloForm.controls[field]) return null;

    const errors = this.articuloForm.controls[field].errors || {};

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

  // VERIFICAR CAMPO VÁLIDO
  isValidFieldArticuloIdForm( field: string): boolean | null{

    return this.articuloIdForm.controls[field].errors
    && this.articuloIdForm.controls[field].touched
  }

  // OBTENER ERROR DEL CAMPO
  getFieldErrorArticuloIdForm(field: string): string | null{

    const control = this.articuloIdForm?.get(field);
    if (!control) return null;

    const errors = control.errors || {};

    if (field === 'idArticulo' && errors['articuloNotFound']) {
      return `No existe ningún artículo con ese id`;
    }

    return null;
  }

}
