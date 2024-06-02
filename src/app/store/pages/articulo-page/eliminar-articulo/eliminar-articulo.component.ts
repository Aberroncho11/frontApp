import { Component } from '@angular/core';
import { ArticuloServicio } from '../../../services/articulo.service';
import { ArticuloDTO } from '../../../interfaces/articulo/articuloDTO.interface';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../validators/validadores';
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

  public idArticulo: number = 0;

  public articuloForm: FormGroup;

  public articuloCargado: boolean = false;

  // CONSTRUCTOR
  constructor(private articuloServicio: ArticuloServicio, private fb: FormBuilder) {

    this.articuloForm = this.fb.group({
      idArticulo: [0, [ Validators.required ], CustomValidators.articuloExistente(this.articuloServicio)],
    });

    this.articuloForm.get('idArticulo')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();
  }

  // VER ARTÍCULO POR ID
  verArticulosPorId(): void {
    this.articuloServicio.getArticuloPorId(this.idArticulo).subscribe(
      articulo => {
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
        this.mostrarTabla = false;
      }
    );
  }

  // ELIMINAR ARTÍCULO
  eliminarArticulo(): void {
    this.articuloServicio.deleteArticle(this.idArticulo).subscribe(
      response => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Articulo eliminado correctamente",
          showConfirmButton: false,
          timer: 1500
        });
        this.idArticulo = 0;
        this.articulo = null;
        this.mostrarTabla = false;
        this.articuloCargado = false;
      },
      error => {
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

  // VERIFICAR CAMPO VÁLIDO
  isValidFieldArticuloForm( field: string): boolean | null{

    return this.articuloForm.controls[field].errors
    && this.articuloForm.controls[field].touched
  }

  // OBTENER ERROR DEL CAMPO
  getFieldErrorArticuloForm(field: string): string | null{

    const control = this.articuloForm?.get(field);
    if (!control) return null;

    const errors = control.errors || {};

    if (field === 'idArticulo' && errors['articuloNotFound']) {
      return `No existe ningún artículo con ese id`;
    }

    return null;
  }

}
