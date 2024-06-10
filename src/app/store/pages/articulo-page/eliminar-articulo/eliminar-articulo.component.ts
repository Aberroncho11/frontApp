import { Component } from '@angular/core';
import { ArticuloServicio } from '../../../services/articulo.service';
import { ArticuloDTO } from '../../../interfaces/articulo/articuloDTO.interface';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../validators/validadores';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'eliminar-articulo',
  templateUrl: './eliminar-articulo.component.html',
  styleUrls: ['./eliminar-articulo.component.css']
})
export class EliminarArticuloComponent {

  // Variables para el manejo de archivos
  public file: File | null = null;

  // Variable para el manejo de la tabla
  public mostrarTabla: boolean = false;

  // Variable para el manejo del artículo
  public articulo: ArticuloDTO | null = null;

  // Variable para el manejo del id del artículo
  public idArticulo: number = 0;

  // Variables para el manejo del formulario
  public articuloForm: FormGroup;

  // Variable para el manejo de la carga de artículos
  public articuloCargado: boolean = false;

  // Constructor
  constructor(private articuloServicio: ArticuloServicio, private fb: FormBuilder) {
    // Inicializar el formulario
    this.articuloForm = this.fb.group({
      idArticulo: [0, [ Validators.required,  Validators.min(1)], CustomValidators.articuloExistente(this.articuloServicio)],
    });
    // Suscribirse a los cambios del campo idArticulo
    this.articuloForm.get('idArticulo')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();
  }

  // Metodo para obtener el campo idArticulo
  verArticulosPorId(): void {
    this.articuloServicio.getArticuloPorId(this.idArticulo).subscribe(
      articulo => {
        // Asignar el artículo obtenido
        this.articulo = articulo;
        // Mostrar la tabla
        this.mostrarTabla = true;
        // Asignar la variable de carga de artículo
        this.articuloCargado = true;
      },
      // Manejo de errores
      error => {
        // Mostrar mensaje de error
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Articulo no encontrado",
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }

  // Metodo para eliminar un artículo
  eliminarArticulo(): void {
    // Mostrar mensaje de confirmación
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podras revertir los cambios!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminalo!"
    }).then((result) => {
      // Si se confirma la eliminación
      if (result.isConfirmed) {
        // Eliminar el artículo
        this.articuloServicio.deleteArticle(this.idArticulo).subscribe(
          response => {
            // Mostrar mensaje de éxito
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Articulo eliminado correctamente",
              showConfirmButton: false,
              timer: 1500
            });
            // Reiniciar las variables
            this.idArticulo = 0;
            this.articulo = null;
            this.mostrarTabla = false;
            this.articuloCargado = false;
          },
          // Manejo de errores
          error => {
            // Mostrar mensaje de error
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Error al eliminar articulo",
              showConfirmButton: false,
              timer: 1500
            });
          }
        );
      }
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
    if(!this.articuloForm?.get(field)) return null;
    // Obtener los errores del campo
    const errors = this.articuloForm.controls[field].errors || {};
    // Recorrer los errores
    if (field === 'idArticulo' && errors['articuloNotFound']) {
      return `No existe ningún artículo con ese id`;
    }

    for (const key of Object.keys(errors)) {
      switch(key) {
        // Si el campo es requerido
        case 'required':
          return 'Este campo es requerido';
        // Si el campo es menor al mínimo
        case 'min':
          return 'El id del artículo debe ser mayor a 0'
      }
    }

    return null;
  }

}
