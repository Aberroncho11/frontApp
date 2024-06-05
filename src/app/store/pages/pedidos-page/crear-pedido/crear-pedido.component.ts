import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
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
  public newArticuloForm: FormGroup;
  public swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  constructor(private pedidoServicio: PedidoServicio, private usuarioServicio: UsuarioServicio, private articuloServicio: ArticuloServicio, private fb: FormBuilder) {
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

    this.newArticuloForm = this.fb.group({
      articuloId: ['', [Validators.required]],
      cantidad: ['', Validators.required]
    });

    this.pedidoForm.get('usuarioId')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe();

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
    this.swalWithBootstrapButtons.fire({
      title: "¿Estás seguro de crear el pedido?",
      text: "No podrás revertirlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, crealo!",
      cancelButtonText: "No, cancelalo!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
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
            this.pedidoForm.reset({
              usuarioId: '',
              codigoPostal: '',
              telefono: ''
            });
            this.articulos.clear();
          }, error => {
            console.error('Error al crear pedido:', error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error al crear el pedido",
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "Tu pedido no se ha creado",
          icon: "error"
        });
      }
    });
  }

  onAddToArticulos(): void {
    if (this.newArticuloForm.invalid) {
      this.newArticuloForm.markAllAsTouched();
      return;
    }
    const articuloId = this.newArticuloForm.get('articuloId')?.value;
    const cantidad = this.newArticuloForm.get('cantidad')?.value;
    this.articuloServicio.getArticuloPorId(articuloId).subscribe(
      articulo => {
        if (articulo) {
          this.articulos.push(this.fb.group({
            articuloId: [articuloId, Validators.required],
            cantidad: [cantidad, Validators.required]
          }));
          this.newArticuloForm.reset();
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
      }
    }

    if (field === 'usuarioId' && errors['usuarioNotFound']) {
      return `No existe ningún usuario con ese id`;
    }

    return null;
  }

  getArticleFieldError(field: string): string | null {
    const control = this.newArticuloForm.get(field);
    if (!control) return null;

    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
      }
    }

    if (field === 'articuloId' && errors['articuloNotFound']) {
      return `No existe ningún artículo con ese id`;
    }

    return null;
  }
}
