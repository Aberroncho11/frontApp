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
import { AlmacenServicio } from '../../../services/almacen.service';
import { AlmacenDTO } from '../../../interfaces/almacen/almacenDTO.interface';

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
      confirmButton: "btn btn-success me-3",
      cancelButton: "btn btn-danger ms-3"
    },
    buttonsStyling: false
  });

  private pedidoServicio = inject(PedidoServicio);

  private usuarioServicio = inject(UsuarioServicio);

  private articuloServicio = inject(ArticuloServicio);

  private almacenServicio = inject(AlmacenServicio);

  private fb = inject(FormBuilder);

  public articulosLista: ArticuloAlmacenDTO[] = [];

  private articulosOriginal: ArticuloAlmacenDTO[] = [];

  public isLoading = true;

  public cantidad: string = '';

  public estado: string = '';

  // Inicializador
  ngOnInit() {

    this.pedidoForm = this.fb.group({
      codigoPostal: ['', [Validators.required, CustomValidators.postalCodeValidator]],
      ciudad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^(?!.* {2,}).*$/)]],
      telefono: ['', [Validators.required, CustomValidators.phoneNumberValidator]],
      contacto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^(?!.* {2,}).*$/)]],
      direccion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(40), Validators.pattern(/^(?!.* {2,}).*$/)]],
      provincia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^(Álava|Albacete|Alicante|Almería|Asturias|Ávila|Badajoz|Baleares|Barcelona|Burgos|Cáceres|Cádiz|Cantabria|Castellón|Ciudad Real|Córdoba|Cuenca|Girona|Granada|Guadalajara|Gipuzkoa|Huelva|Huesca|Jaén|La Rioja|Las Palmas|León|Lleida|Lugo|Madrid|Málaga|Murcia|Navarra|Ourense|Palencia|Pontevedra|Salamanca|Segovia|Sevilla|Soria|Tarragona|Santa Cruz de Tenerife|Teruel|Toledo|Valencia|Valladolid|Bizkaia|Zamora|Zaragoza|Ceuta|Melilla)$/)]],
      articulos: this.fb.array([], Validators.required)
    });

    this.newArticuloForm = this.fb.group({
      nombreArticulo: ['',],
      cantidad: ['',],
      articuloId: ['']
    });

    setTimeout(() => {
    document.querySelector('.loading-overlay')?.classList.add('hidden');
    }, 500);

    this.articuloServicio.getArticulos()
    .subscribe({
      next: (articulos: ArticuloAlmacenDTO[]) => {
        articulos.forEach(articulo => {
          articulo.almacen.forEach(estanteria => {
            if (estanteria.cantidad > 0) {
              this.articulosLista.push(articulo);
            }
          });
        });
        this.articulosOriginal = [...this.articulosLista];
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
    else{
      this.cantidad = '';
      this.estado = '';
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
        this.cantidad = String(estanteria[0].cantidad);
        this.estado = articuloSeleccionado.estadoArticulo;
    }
  }

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

            this.pedidoServicio.addPedido(pedidoData).subscribe({
              next: () => {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Pedido correctamente creado",
                  showConfirmButton: false,
                  timer: 1500
                });

                this.pedidoForm.reset();

                this.articulos.clear();

                this.articulosLista = [];

                this.newArticuloForm.get('nombreArticulo')?.setValue('');

                this.newArticuloForm.get('cantidad')?.setValue('');

                this.articulosOriginal = [];

                this.articuloServicio.getArticulos().subscribe({
                  next: (articulos: ArticuloAlmacenDTO[]) => {
                    articulos.forEach(articulo => {
                      articulo.almacen.forEach(estanteria => {
                        if (estanteria.cantidad > 0) {
                          this.articulosLista.push(articulo);
                        }
                      });
                    });
                    this.articulosOriginal = [...this.articulosLista];
                  },
                  error: error => {
                    console.error('Error al obtener los artículos:', error);
                  }
                });
              },
              error: error => {
                console.error('Error al crear pedido:', error);
                if(error.message = "Uno de los productos enviados no tiene suficiente cantidad y está pendiente de eliminar por lo que no se va a reponer, intente de nuevo con menos cantidad"){
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Uno de los productos enviados no tiene suficiente cantidad y está pendiente de eliminar por lo que no se va a reponer, intente de nuevo con menos cantidad",
                  });
                }
                else{
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Error al crear el pedido",
                  });
                }
              }
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

  onAddToArticulos(): void {
    if (this.newArticuloForm.invalid) {
      this.newArticuloForm.markAllAsTouched();
      return;
    }

    const nombre = this.newArticuloForm.get('nombreArticulo')?.value;

    const cantidad = this.newArticuloForm.get('cantidad')?.value;

    this.articuloServicio.getArticuloPorNombre(nombre).subscribe({
      next: (articulo: ArticuloDTO) => {
        this.almacenServicio.getEstanteriaPorArticulo(articulo.idArticulo).subscribe({
          next: (almacen: AlmacenDTO) => {
            if (articulo.estadoArticulo === 'Pendiente de eliminar' && cantidad > almacen.cantidad) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Este artículo está Pendiente de eliminar por lo que no se añadirá más stock y la cantidad que has introducido es mayor que la que tiene. Vuelve a intentarlo con menos cantidad.`,
              });
            } else {
              this.articulos.push(this.fb.group({
                articuloId: [String(articulo.idArticulo), Validators.required],
                nombreArticulo: [nombre, Validators.required],
                cantidad: [cantidad, Validators.required]
              }));

              this.eliminarArticuloDeLista(nombre);

              this.newArticuloForm.reset();

              this.newArticuloForm.get('nombreArticulo')?.setValue('');

              this.newArticuloForm.get('cantidad')?.setValue('');

              this.cantidad = '';

              this.estado = '';
            }
          },
          error: (error) => {
            console.error('Error al obtener el almacén:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo obtener la información del almacén. Inténtalo de nuevo más tarde.',
            });
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener el artículo:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No existe ningún artículo con el nombre ${nombre}`,
        });
      }
    });
  }

  eliminarArticuloDeLista(nombre: string): void {
    const index = this.articulosLista.findIndex(articulo => articulo.nombre === nombre);
    if (index !== -1) {
      this.articulosLista.splice(index, 1);
    }
  }

  onDeleteArticulo(index: number): void {
    const articuloEliminado = this.articulos.at(index).value.nombreArticulo;
    this.articulos.removeAt(index);
    this.reagregarArticuloALista(articuloEliminado);
  }

  reagregarArticuloALista(nombre: string): void {
    const articuloOriginal = this.articulosOriginal.find(articulo => articulo.nombre === nombre);
    if (articuloOriginal && !this.articulosLista.some(articulo => articulo.nombre === nombre)) {
      this.articulosLista.push(articuloOriginal);
    }
  }

  isValidField(field: string): boolean | null {
    const control = this.pedidoForm.controls[field];
    return control?.errors !== null && control?.touched;
  }

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
        case 'pattern':
          if (field === 'provincia') {
            return 'Provincia inválida';
          } else if (field === 'ciudad' || field === 'contacto' || field === 'direccion') {
            return 'No se permiten espacios en blanco consecutivos';
          }
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

  isValidFieldNewArticulo(field: string): boolean | null {
    const control = this.newArticuloForm.controls[field];
    return control?.errors !== null && control?.touched;
  }

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
