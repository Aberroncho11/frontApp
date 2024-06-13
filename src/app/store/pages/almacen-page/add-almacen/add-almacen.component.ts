import { Component } from '@angular/core';
import { AlmacenServicio } from '../../../services/almacen.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlmacenDTO } from '../../../interfaces/almacen/almacenDTO.interface';
import Swal from 'sweetalert2';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { CustomValidators } from '../../../../validators/validadores';

@Component({
  selector: 'add-almacen',
  templateUrl: './add-almacen.component.html',
  styleUrls: ['./add-almacen.component.css']
})
export class AddAlmacenComponent {

  // Formulario de Almacen
  public almacenForm: FormGroup;

  // Constructor
  constructor(private almacenServicio: AlmacenServicio, private fb: FormBuilder) {

    // Inicializar el formulario
    this.almacenForm = this.fb.group({
      idEstanteria: ['', [Validators.required, Validators.min(1)]],
      cantidad: ['', [Validators.required, Validators.min(1)]],
    });

    // Suscribirse a los cambios del campo idEstanteria
    this.almacenForm.get('idEstanteria')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();
  }

  // Getter para obtener los valores del formulario
  get Almacen(): AlmacenDTO {
    return this.almacenForm.value as AlmacenDTO;
  }

  /**
   * Método para añadir un artículo al almacén
   * @returns void
   * @memberof AddAlmacenComponent
   */
  addAlmacen(): void {

    // Comprobamos si el formulario es válido
    if (this.almacenForm.invalid) {
      // Marcamos todos los campos como tocados
      this.almacenForm.markAllAsTouched();
      return;
    }

    // Añadimos el artículo al almacén
    this.almacenServicio.addAlmacen(this.Almacen)
      .subscribe(
        () => {
          // Mostramos un mensaje de éxito
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Añadido al almacén correctamente",
            showConfirmButton: false,
            timer: 1500
          });
          // Reseteamos el formulario
          this.almacenForm.reset({
            idEstanteria: 0,
            cantidad: 0
          });

        },
        // Manejamos el error
        error => {
          console.error('Error al añadir al almacén:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al agregar al almacén. Por favor, inténtalo de nuevo más tarde.',
          });
        }
      );
  }

  /**
   * Método para comprobar si un campo es válido
   * @param field
   * @returns
   * @memberof AddAlmacenComponent
   */
  isValidField(field: string): boolean | null {
    // Comprobamos si el campo es válido
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

    // Obtenemos el control del campo
    const control = this.almacenForm?.get(field);
    // Comprobamos si el control existe
    if (!control) return null;

    // Obtenemos los errores del control
    const errors = control.errors || {};
    // Iteramos sobre los errores
    for (const key of Object.keys(errors)) {
      switch (key) {
        // Comprobamos el tipo de error
        case 'required':
          return 'Este campo es requerido';
        // Comprobamos el tipo de error
        case 'min':
          return 'El valor debe ser mayor que 0';
      }
    }

    // Comprobamos si el campo es idEstanteria y si hay un error de estanteriaNotFound
    if (field === 'idEstanteria' && errors['estanteriaNotFound']) {
      return 'No existe ninguna estantería con ese id';
    }

    return null;
  }
}
