import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PedidoServicio } from '../../../services/pedido.service';
import { UsuarioServicio } from '../../../services/usuario.service';
import { ArticuloServicio } from '../../../services/articulo.service';
import { PedidoPostDTO } from '../../../interfaces/pedido/pedidoPostDTO.interface';
import { CustomValidators } from '../../../../validators/validadores';

@Component({
  selector: 'crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrls: ['./crear-pedido.component.css']
})
export class CrearPedidoComponent {

  // Variables
  // Formulario de pedido
  public pedidoForm: FormGroup;

  // Formulario de nuevo artículo
  public newArticuloForm: FormGroup;

  // SweetAlert
  public swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  // Constructor
  constructor(private pedidoServicio: PedidoServicio, private usuarioServicio: UsuarioServicio, private articuloServicio: ArticuloServicio, private fb: FormBuilder) {

    // Inicializar el formulario
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

    // Inicializar el formulario de nuevo artículo
    this.newArticuloForm = this.fb.group({
      articuloId: ['', [Validators.required]],
      cantidad: ['', Validators.required]
    });

    // Suscribirse a los cambios del campo usuarioId
    this.pedidoForm.get('usuarioId')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe();

  }

  // Getters
  get pedido(): PedidoPostDTO {
    return this.pedidoForm.value as PedidoPostDTO;
  }

  // Getters
  get articulos(): FormArray {
    return this.pedidoForm.get('articulos') as FormArray;
  }

  /**
   * Método para crear un pedido
   * @returns void
   * @memberof CrearPedidoComponent
   */
  crearPedido(): void {
    // Comprobar si el formulario es válido
    if (this.pedidoForm.invalid) {
      // Marcar todos los campos como tocados
      this.pedidoForm.markAllAsTouched();
      return;
    }
    // Mostrar un mensaje de confirmación
    this.swalWithBootstrapButtons.fire({
      title: "¿Estás seguro de crear el pedido?",
      text: "No podrás revertirlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, crealo!",
      cancelButtonText: "No, cancelalo!",
      reverseButtons: true
    }).then((result) => {
      // Si se confirma la acción
      if (result.isConfirmed) {
        // Llamar al servicio para crear el pedido
        this.pedidoServicio.addPedido(this.pedido)
          .subscribe(response => {
            // Mostrar un mensaje de éxito
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Pedido correctamente creado",
              showConfirmButton: false,
              timer: 1500
            });
            // Limpiar el formulario
            this.pedidoForm.reset();
            // Limpiar los artículos
            this.pedidoForm.reset({
              usuarioId: '',
              codigoPostal: '',
              telefono: ''
            });
            // Limpiar los artículos
            this.articulos.clear();
          // Si hay un error
          }, error => {
            console.error('Error al crear pedido:', error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error al crear el pedido",
            });
          });
      // Si se cancela la acción
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "Tu pedido no se ha creado",
          icon: "error"
        });
      }
    });
  }

  /**
   * Método para añadir un artículo al pedido
   * @returns void
   * @memberof CrearPedidoComponent
   */
  onAddToArticulos(): void {
    // Comprobar si el formulario es válido
    if (this.newArticuloForm.invalid) {
      // Marcar todos los campos como tocados
      this.newArticuloForm.markAllAsTouched();
      return;
    }
    // Obtener el id y la cantidad del artículo
    const articuloId = this.newArticuloForm.get('articuloId')?.value;
    const cantidad = this.newArticuloForm.get('cantidad')?.value;
    // Función para comprobar si el artículo existe
    this.articuloServicio.getArticuloPorId(articuloId).subscribe(
      articulo => {
        // Si existe el artículo
        if (articulo) {
          // Añadir el artículo al array de artículos
          this.articulos.push(this.fb.group({
            articuloId: [articuloId, Validators.required],
            cantidad: [cantidad, Validators.required]
          }));
          // Limpiar el formulario de nuevo artículo
          this.newArticuloForm.reset();
        } else {
          // Mostrar un mensaje de error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No existe ningún artículo con el id ${articuloId}`,
          });
        }
      },
      error => {
        // Mostrar un mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No existe ningún artículo con este ID',
        });
      }
    );
  }

  /**
   * Método para eliminar un artículo del pedido
   * @param {number} index
   * @returns void
   * @memberof CrearPedidoComponent
   */
  onDeleteArticulo(index: number): void {
    this.articulos.removeAt(index);
  }

  /**
   * Método para comprobar si un campo es válido
   * @param {string} field
   * @returns {boolean | null}
   * @memberof CrearPedidoComponent
   */
  isValidField(field: string): boolean | null {
    return this.pedidoForm.controls[field].errors
    && this.pedidoForm.controls[field].touched;
  }

  /**
   * Método para comprobar si un campo es válido en un array
   * @param {FormArray} formArray
   * @param {number} index
   * @returns {boolean | null}
   * @memberof CrearPedidoComponent
   */
  isValidFieldInArray(formArray: FormArray, index: number): boolean | null {
    const control = formArray.at(index);
    return control?.errors && control.touched ? true : null;
  }

  /**
   * Método para obtener el mensaje de error de un campo
   * @param {string} field
   * @returns {string | null}
   * @memberof CrearPedidoComponent
   */
  getFieldError(field: string): string | null {
    // Si no hay control
    if (!this.pedidoForm.controls[field]) return null;
    // Obtener los errores
    const errors = this.pedidoForm.controls[field].errors || {};
    // Obtener los errores
    for (const key of Object.keys(errors)) {
      switch (key) {
        // Si el campo es requerido
        case 'required':
          return 'Este campo es requerido';
        // Si el campo no tiene la longitud minima
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
      }
    }
    // Si el campo es usuarioId y no se ha encontrado el usuario
    if (field === 'usuarioId' && errors['usuarioNotFound']) {
      return `No existe ningún usuario con ese id`;
    }

    return null;
  }

  /**
   * Método para obtener el mensaje de error de un campo en un array
   * @param {FormArray} formArray
   * @param {number} index
   * @returns {string | null}
   * @memberof CrearPedidoComponent
   */
  getArticleFieldError(field: string): string | null {
    // Si no hay control
    if (!this.newArticuloForm.controls[field]) return null;
    // Obtener los errores
    const errors = this.newArticuloForm.controls[field].errors || {};
    // Recorrer los errores
    for (const key of Object.keys(errors)) {
      switch (key) {
        // Si el campo es requerido
        case 'required':
          return 'Este campo es requerido';
      }
    }
    // Si el campo es articuloId y no se ha encontrado el artículo
    if (field === 'articuloId' && errors['articuloNotFound']) {
      return `No existe ningún artículo con ese id`;
    }

    return null;
  }
}
