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

  public file: File | null = null;

  public mostrarTabla: boolean = false;

  public articulo: ArticuloDTO | null = null;

  public articulosLista: ArticuloDTO[] = [];

  public nombre: string = '';

  public articuloForm: FormGroup;

  public articuloCargado: boolean = false;

  constructor(private articuloServicio: ArticuloServicio, private fb: FormBuilder) {

    this.articuloForm = this.fb.group({
      nombre: ['', [Validators.required]],
    });

    this.articuloForm.get('nombre')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();

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

  onArticuloChange(): void {
    var nombre = this.articuloForm.get('nombre')?.value;
    this.nombre = nombre;
  }

  verArticuloPorNombre(): void {
    console.log(this.nombre)
    this.articuloServicio.getArticuloPorNombre(this.nombre).subscribe(
      articulo => {
        console.log(articulo);
        this.articulo = articulo;
        this.mostrarTabla = true;
        this.articuloCargado = true;
      },
      error => {
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

  eliminarArticulo(): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir los cambios!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, elimínalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.articuloServicio.deleteArticle(this.nombre).subscribe({
          next: response => {
            let successMsg = response.message || "Operación realizada";

            if (response.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: successMsg,
                showConfirmButton: false,
                timer: 1500
              });
              this.articuloForm.reset();
              this.articulo = null;
              this.mostrarTabla = false;
              this.articuloCargado = false;
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Error",
                text: successMsg,
                showConfirmButton: true
              });
            }
          },
          error: error => {
            let errorMsg = 'Error al eliminar artículo';

            if (error && error.error && error.error.message) {
              errorMsg = error.error.message;
            }

            let errorTitle = "Error";
            if (errorMsg === "Artículo no encontrado") {
              errorTitle = "Artículo no encontrado";
            } else if (errorMsg === "Este artículo ya está en proceso de eliminarse") {
              errorTitle = "Artículo en proceso de eliminación";
            } else if (errorMsg === "No se puede eliminar el artículo porque forma parte de un pedido pendiente de stock") {
              errorTitle = "Pedido pendiente de stock";
            } else if (errorMsg === "No se pudo eliminar el artículo") {
              errorTitle = "Error de eliminación";
            }

            Swal.fire({
              position: "center",
              icon: "error",
              title: errorTitle,
              text: errorMsg,
              showConfirmButton: true
            });

            this.articuloForm.reset();

            this.mostrarTabla = false;
          }
        });
      }
    });
  }



  isValidFieldArticuloForm( field: string): boolean | null{

    return this.articuloForm.controls[field].errors
    && this.articuloForm.controls[field].touched
  }

  getFieldErrorArticuloForm(field: string): string | null{

    if(!this.articuloForm?.get(field)) return null;
    const errors = this.articuloForm.controls[field].errors || {};
    if (field === 'idArticulo' && errors['articuloNotFound']) {
      return `No existe ningún artículo con ese id`;
    }

    for (const key of Object.keys(errors)) {
      switch(key) {
        case 'required':
          return 'Este campo es requerido';
        case 'min':
          return 'El id del artículo debe ser mayor a 0'
      }
    }

    return null;
  }

}
