import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PedidoServicio } from '../../../services/pedido.service';
import { UsuarioServicio } from '../../../services/usuario.service';
import { ArticuloServicio } from '../../../services/articulo.service';
import { PedidoPostDTO } from '../../../interfaces/pedido/pedidoPostDTO.interface';
import { CustomValidators } from '../../../../validators/validadores';
import { ArticuloAlmacenDTO } from '../../../interfaces/articulo/articuloAlmacenDTO.interface';
import { ArticuloDTO } from '../../../interfaces/articulo/articuloDTO.interface';

@Component({
  selector: 'crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrls: ['./crear-pedido.component.css']
})
export class CrearPedidoComponent implements OnInit{

  public pedidoForm!: FormGroup;

  public newArticuloForm!: FormGroup;

  public swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success me-2",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  private pedidoServicio = inject(PedidoServicio);

  private usuarioServicio = inject(UsuarioServicio);

  private articuloServicio = inject(ArticuloServicio);

  private fb = inject(FormBuilder);

  public articulosLista: ArticuloAlmacenDTO[] = [];

  public cantidadOptions: number[] = [];


  // Inicializador
  ngOnInit() {

    this.pedidoForm = this.fb.group({
      codigoPostal: ['', [Validators.required, CustomValidators.postalCodeValidator]],
      ciudad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      telefono: ['', [Validators.required, CustomValidators.phoneNumberValidator]],
      contacto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      direccion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(40)]],
      provincia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      articulos: this.fb.array([], Validators.required)
    });

    this.newArticuloForm = this.fb.group({
      nombreArticulo: ['', [Validators.required] ],
      cantidad: ['', [Validators.required] ],
      articuloId: ['']
    });

    this.articuloServicio.getArticulos()
    .subscribe({
      next: (articulos: ArticuloAlmacenDTO[]) => {

        articulos.forEach(articulo => {
          articulo.almacen.forEach(estanteria => {
            if (estanteria.cantidad > 0) {
              this.articulosLista.push(articulo);
            }
            console.log(this.articulosLista)
          });
        });
      },
      error: (error) => {
        console.error('Error al obtener los artículos:', error);
      }
    });



    const camposPedidoForm = ['codigoPostal', 'ciudad', 'telefono', 'contacto', 'direccion', 'provincia'];

    camposPedidoForm.forEach(campo => {

      this.pedidoForm.get(campo)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe();

    });

    const camposNewArticuloForm = ['nombreArticulo', 'cantidad'];

    camposNewArticuloForm.forEach(campo => {

      this.pedidoForm.get(campo)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe();

    });

  }

  // Getters
  get pedido(): PedidoPostDTO {

    return this.pedidoForm.value as PedidoPostDTO;
  }

  get articulos(): FormArray {

    return this.pedidoForm.get('articulos') as FormArray;
  }

  /**
   * Método para comprobar si eñ nombre cambia
   * @member CrearPedidoComponent
   */
  onArticuloNombreChange(): void {
    var nombre = this.newArticuloForm.get('nombreArticulo')?.value;
    if (nombre) {
        this.updateCantidadDisponible(nombre);
    }
  }

  /**
   * Método para actualizar la cantidad disponible
   * @param nombre
   * @member CrearPedidoComponent
   */
  updateCantidadDisponible(nombre: string): void {
    const articuloSeleccionado = this.articulosLista.find(articulo => articulo.nombre == nombre);
    if (articuloSeleccionado) {
        var estanteria = articuloSeleccionado.almacen;
        estanteria.forEach(estanteria => {
          this.cantidadOptions = Array.from({ length: estanteria.cantidad }, (_, i) => i + 1);
        });
    }
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

    this.usuarioServicio.getUserFromToken().subscribe(userId => {
      if (userId !== null) {
        const pedidoData: PedidoPostDTO = {
          ...this.pedidoForm.value,
          usuarioId: userId
        };

        console.log(pedidoData);

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

    const nombre = this.newArticuloForm.get('nombreArticulo')?.value;

    const cantidad = this.newArticuloForm.get('cantidad')?.value;

    this.articuloServicio.getArticuloPorNombre(nombre).subscribe(
      (articulo: ArticuloDTO) => {

          this.articulos.push(this.fb.group({
            articuloId: [String(articulo.idArticulo), Validators.required],
            nombreArticulo: [nombre, Validators.required],
            cantidad: [cantidad, Validators.required]
          }));

          console.log(this.articulos);

          this.newArticuloForm.reset();

          this.newArticuloForm.get('nombreArticulo')?.setValue('');

          this.newArticuloForm.get('cantidad')?.setValue('');

      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No existe ningún artículo con el nombre ${nombre}`,
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
   * Método para comprobar si un campo es válido
   * @param {string} field
   * @returns {boolean | null}
   * @memberof CrearPedidoComponent
   */
  isValidFieldNewArticulo(field: string): boolean | null {
    const control = this.newArticuloForm.controls[field];
    return control?.errors !== null && control?.touched;
  }

  /**
   * Método para obtener el mensaje de error de un campo
   * @param {string} field
   * @returns {string | null}
   * @memberof CrearPedidoComponent
   */
  getFieldErrorNewArticulo(field: string): string | null {

    const control = this.newArticuloForm.controls[field];
    if (!control) return null;

    const errors = control.errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
      }
    }

    return null;

  }

}
