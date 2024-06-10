<<<<<<< HEAD
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
=======
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
import Swal from 'sweetalert2';
import { PedidoServicio } from '../../../services/pedido.service';
import { UsuarioServicio } from '../../../services/usuario.service';
import { ArticuloServicio } from '../../../services/articulo.service';
import { PedidoPostDTO } from '../../../interfaces/pedido/pedidoPostDTO.interface';

@Component({
  selector: 'crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrls: ['./crear-pedido.component.css']
})
export class CrearPedidoComponent implements OnInit{

<<<<<<< HEAD
  public pedidoForm!: FormGroup;
=======
  // Formulario de pedido
  public pedidoForm: FormGroup;
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b

  public newArticuloForm!: FormGroup;

  public swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  private pedidoServicio = inject(PedidoServicio);

  private usuarioServicio = inject(UsuarioServicio);

  private articuloServicio = inject(ArticuloServicio);

  private fb = inject(FormBuilder);

  // Inicializador
  ngOnInit() {

    this.pedidoForm = this.fb.group({
<<<<<<< HEAD
      codigoPostal: ['', [Validators.required, CustomValidators.postalCodeValidator]],
      ciudad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      telefono: ['', [Validators.required, CustomValidators.phoneNumberValidator]],
      contacto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      direccion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(40)]],
      provincia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
=======
      usuarioId: [0, [Validators.required]],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^[0-5][0-9]{4}$/)]],
      ciudad: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      contacto: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
      articulos: this.fb.array([], Validators.required)
    });

    this.newArticuloForm = this.fb.group({
      articuloId: ['', [Validators.required]],
      cantidad: ['', [Validators.required, Validators.min(1)]]
    });

<<<<<<< HEAD
    const camposPedidoForm = ['codigoPostal', 'ciudad', 'telefono', 'contacto', 'direccion', 'provincia'];

    camposPedidoForm.forEach(campo => {

      this.pedidoForm.get(campo)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe();

    });

    const camposNewArticuloForm = ['articuloId', 'cantidad'];

    camposNewArticuloForm.forEach(campo => {

      this.pedidoForm.get(campo)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe();

=======
    const fieldsToWatch = ['usuarioId', 'codigoPostal', 'telefono', 'contacto', 'direccion', 'provincia', 'articulos'];

    fieldsToWatch.forEach(field => {
      this.pedidoForm.get(field)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe();
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
    });

  }

  // Getters
<<<<<<< HEAD
  get pedido(): PedidoPostDTO {

    return this.pedidoForm.value as PedidoPostDTO;
  }

  get articulos(): FormArray {

=======
  get currentPedido(): PedidoPostDTO {
    return this.pedidoForm.value as PedidoPostDTO;
  }

  // Getters
  get currentArticulos(): FormArray {
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
    return this.pedidoForm.get('articulos') as FormArray;
  }

  /**
   * Método para crear un pedido
   * @returns void
   * @memberof CrearPedidoComponent
   */
  crearPedido(): void {
    if (this.pedidoForm.invalid) {
      this.pedidoForm.markAllAsTouched();
      return;
    }
<<<<<<< HEAD

    this.usuarioServicio.getUserFromToken().subscribe(userId => {
      if (userId !== null) {
        const pedidoData: PedidoPostDTO = {
          ...this.pedidoForm.value,
          usuarioId: userId
        };

=======
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
        this.pedidoServicio.addPedido(this.currentPedido)
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
            this.currentArticulos.clear();
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
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
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
            this.pedidoServicio.addPedido(pedidoData)
              .subscribe(response => {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Pedido correctamente creado",
                  showConfirmButton: false,
                  timer: 1500
                });

                this.pedidoForm.reset();
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
      } else {
        console.error('No se pudo obtener el ID del usuario');
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener el ID del usuario",
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

    if (this.newArticuloForm.invalid) {
      this.newArticuloForm.markAllAsTouched();
      return;
    }

    const articuloId = this.newArticuloForm.get('articuloId')?.value;

    const cantidad = this.newArticuloForm.get('cantidad')?.value;

    this.articuloServicio.getArticuloPorId(articuloId).subscribe(
      articulo => {
        if (articulo) {
<<<<<<< HEAD

          this.articulos.push(this.fb.group({
=======
          // Añadir el artículo al array de artículos
          this.currentArticulos.push(this.fb.group({
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
            articuloId: [articuloId, Validators.required],
            cantidad: [cantidad, [Validators.required, Validators.min(1)]]
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
          text: `No existe ningún artículo con el id ${articuloId}`,
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
    this.currentArticulos.removeAt(index);
  }

  /**
   * Método para comprobar si un campo es válido
   * @param {string} field
   * @returns {boolean | null}
   * @memberof CrearPedidoComponent
   */
  isValidField(field: string): boolean | null {
    const control = this.pedidoForm.controls[field];
    return control?.errors !== null && control?.touched;
  }

  /**
   * Método para obtener el mensaje de error de un campo
   * @param {string} field
   * @returns {string | null}
   * @memberof CrearPedidoComponent
   */
  getFieldError(field: string): string | null {

    const control = this.pedidoForm.controls[field];
    if (!control) return null;

    const errors = control.errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'maxlength':
          return `La longitud máxima debe ser de ${errors['maxlength'].requiredLength} caracteres`;
      }
    }

    if (field === 'codigoPostal' && control.hasError('postalCodeValidator')) {
      return 'Código postal inválido';
    }
    if (field === 'telefono' && control.hasError('phoneNumberValidator')) {
      return 'Número de teléfono inválido';
    }
    return null;

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
<<<<<<< HEAD
=======
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
        // Si el campo no tiene la longitud mínima
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'pattern':
          if(field === 'codigoPostal') {
            return 'El código postal debe tener 5 dígitos';
          } else if(field === 'telefono') {
            return 'El teléfono debe tener 9 dígitos';
          }
      }
    }
    // Si el campo es usuarioId y no se ha encontrado el usuario
    if (field === 'usuarioId' && errors['usuarioNotFound']) {
      return `No existe ningún usuario con ese id`;
    }

    return null;
  }

  /**
>>>>>>> 29c04f21e2afb9e3c515046a0b474e3637570e9b
   * Método para obtener el mensaje de error de un campo en un array
   * @param {FormArray} formArray
   * @param {number} index
   * @returns {string | null}
   * @memberof CrearPedidoComponent
   */
  getArticleFieldError(field: string): string | null {
    const control = this.newArticuloForm.controls[field];
    if (!control) return null;

    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'min':
          return 'La cantidad debe ser mayor que 0';
      }
    }

    if (field === 'articuloId' && control.hasError('articuloNotFound')) {
      return `No existe ningún artículo con ese id`;
    }
    return null;
  }
}
