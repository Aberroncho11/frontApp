import { Component, OnInit, inject } from '@angular/core';
import { AlmacenServicio } from '../../../services/almacen.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlmacenDTO } from '../../../interfaces/almacen/almacenDTO.interface';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { ArticuloDTO } from '../../../interfaces/articulo/articuloDTO.interface';
import { ArticuloServicio } from '../../../services/articulo.service';
import { AlmacenAddDTO } from '../../../interfaces/almacen/almacenAddDTO.interface';

@Component({
  selector: 'add-almacen',
  templateUrl: './add-almacen.component.html',
  styleUrls: ['./add-almacen.component.css']
})
export class AddAlmacenComponent implements OnInit{

  public almacenForm!: FormGroup;

  public articulosLista: ArticuloDTO[] =  [];

  private almacenServicio = inject(AlmacenServicio);

  private fb = inject(FormBuilder);

  private articuloServicio = inject(ArticuloServicio);

  public idArticulo!: number;

  public isLoading = true;

  ngOnInit() {

    this.almacenForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.min(1)]],
      cantidad: ['', [Validators.required, Validators.min(1)]],
    });

    setTimeout(() => {
      document.querySelector('.loading-overlay')?.classList.add('hidden');
      }, 500);

    const campos = ['idEstanteria', 'cantidad'];

    campos.forEach(campo => {

      this.almacenForm.get(campo)?.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe();

    });

    this.articuloServicio.getEstanteriasConArticulos()
    .subscribe({
      next: (estanterias: AlmacenDTO[]) => {
        estanterias.forEach(estanteria => {
          this.articuloServicio.getArticuloPorId(estanteria.articuloAlmacen)
          .subscribe({
            next: (articulo: ArticuloDTO) => {
              if(articulo.estadoArticulo === 'Disponible'){
                this.articulosLista.push(articulo);
              }
            }
          })
        });
      },
      error: (error) => {
        console.error('Error al obtener los artículos:', error);
      }
    });
  }

  /**
   * Método para añadir un artículo al almacén
   * @returns void
   * @memberof AddAlmacenComponent
   */
  addAlmacen(): void {
    if (this.almacenForm.invalid) {
      this.almacenForm.markAllAsTouched();
      return;
    }

    const nombre = this.almacenForm.get('nombre')?.value;
    const cantidad = this.almacenForm.get('cantidad')?.value;

    this.articuloServicio.getArticuloPorNombre(nombre).pipe(
      switchMap((articulo: ArticuloDTO) => {
        return this.almacenServicio.getEstanteriaPorArticulo(articulo.idArticulo).pipe(
          switchMap((estanteria: AlmacenDTO) => {
            const almacen: AlmacenAddDTO = {
              cantidad: cantidad,
              articuloAlmacen: estanteria.articuloAlmacen
            };
            return this.almacenServicio.addAlmacen(almacen);
          })
        );
      })
    ).subscribe({
      next: () => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Añadido al almacén correctamente",
          showConfirmButton: false,
          timer: 1500
        });

        this.almacenForm.reset();

        this.almacenForm.get('nombre')?.setValue('');

      },
      error: error => {
        console.error('Error al añadir al almacén:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Hubo un error al agregar al almacén. Por favor, inténtalo de nuevo más tarde.',
        });
      }
    });
  }

  /**
   * Método para comprobar si un campo es válido
   * @param field
   * @returns
   * @memberof AddAlmacenComponent
   */
  isValidField(field: string): boolean | null {
    return this.almacenForm.controls[field].errors
    && this.almacenForm.controls[field].touched;
  }

  /**
   * Método para obtener el error de un campo
   * @param field
   * @returns
   * @memberof AddAlmacenComponent
   */
  getFieldError(field: string): string | null {

    const control = this.almacenForm?.get(field);
    if (!control) return null;

    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'min':
          return 'El valor debe ser mayor que 0';
      }
    }

    return null;
  }
}
