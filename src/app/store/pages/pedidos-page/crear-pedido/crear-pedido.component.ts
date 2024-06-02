import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, switchMap, map, first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PedidoServicio } from '../../../services/pedido.service';
import { UsuarioServicio } from '../../../services/usuario.service';
import { ArticuloServicio } from '../../../services/articulo.service';
import { PedidoPostDTO } from '../../../interfaces/pedido/pedidoPostDTO.interface';
import { CustomValidators } from '../../../validators/validadores';

@Component({
  selector: 'crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrls: ['./crear-pedido.component.css']
})
export class CrearPedidoComponent {

  public pedidoForm: FormGroup;
  public newArticulo: FormGroup;

  constructor(
    private pedidoServicio: PedidoServicio,
    private usuarioServicio: UsuarioServicio,
    private articuloServicio: ArticuloServicio,
    private fb: FormBuilder
  ) {
    // MIRAR VALIDADORES AHI ESTA EL ERROR DE CREAR PEDIDO, mirarlo en back y front
    this.pedidoForm = this.fb.group({
      usuarioId: [0, [Validators.required]],
      codigoPostal: ['', [Validators.required, CustomValidators.postalCodeValidator]],
      ciudad: ['', [Validators.required]],
      telefono: ['', [Validators.required, CustomValidators.phoneNumberValidator]],
      contacto: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      articulos: this.fb.array([], Validators.required)
    });

    this.newArticulo = this.fb.group({
      articuloId: ['', [Validators.required], [this.articleExistsValidator()]],
      cantidad: ['', Validators.required]
    });
  }

  get pedido(): PedidoPostDTO {
    return this.pedidoForm.value as PedidoPostDTO;
  }

  get articulos(): FormArray {
    return this.pedidoForm.get('articulos') as FormArray;
  }

  crearPedido(): void {
    if (this.pedidoForm.invalid) {
      this.pedidoForm.markAllAsTouched();
      return;
    }

    this.pedidoServicio.addPedido(this.pedido)
      .subscribe(response => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Pedido correctamente creado",
          showConfirmButton: false,
          timer: 1500
        });
        this.pedidoForm.reset();
        this.pedidoForm.patchValue({
          usuarioId: '',
          codigoPostal: '',
          telefono: ''
        });
        this.articulos.clear();

      }, error => {
        console.log(this.pedido);
        console.error('Error al crear pedido:', error);
      });
  }

  onAddToArticulos(): void {
    if (this.newArticulo.invalid) {
      this.newArticulo.markAllAsTouched();
      return;
    }

    const articuloId = this.newArticulo.get('articuloId')?.value;
    const cantidad = this.newArticulo.get('cantidad')?.value;

    this.articuloServicio.getArticuloPorId(articuloId).subscribe(
      articulo => {
        if (articulo) {
          this.articulos.push(this.fb.group({
            articuloId: [articuloId, Validators.required],
            cantidad: [cantidad, Validators.required]
          }));
          this.newArticulo.reset();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No existe ningún artículo con el id ${articuloId}`,
          });
        }
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No existe ningún artículo con este ID',
        });
      }
    );
  }

  onDeleteArticulo(index: number): void {
    this.articulos.removeAt(index);
  }

  isValidField(field: string): boolean | null {
    const control = this.pedidoForm.get(field);
    return control?.errors && control.touched ? true : null;
  }

  isValidFieldInArray(formArray: FormArray, index: number): boolean | null {
    const control = formArray.at(index);
    return control?.errors && control.touched ? true : null;
  }

  getFieldError(field: string): string | null {
    const control = this.pedidoForm.get(field);
    if (!control) return null;

    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'userNotFound':
          return 'No existe ningún usuario con este id';
      }
    }
    return null;
  }

  getArticleFieldError(field: string): string | null {
    const control = this.newArticulo.get(field);
    if (!control) return null;

    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'articleNotFound':
          return `No existe ningún usuario con el id ${this.pedido.usuarioId}`;
      }
    }
    return null;
  }

  userExistsValidator(): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return control.valueChanges.pipe(
        debounceTime(1000),
        first(),
        switchMap(value => this.usuarioServicio.getUsuarioPorId(value).pipe(
          map(user => (user ? null : { userNotFound: true })),
          catchError(() => of({ userNotFound: true }))
        ))
      );
    };
  }

  articleExistsValidator(): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return this.articuloServicio.getArticuloPorId(control.value).pipe(
        map(article => (article ? null : { articleNotFound: true })),
        catchError(() => of({ articleNotFound: true }))
      );
    };
  }

}
