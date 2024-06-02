import { Component } from '@angular/core';
import { AlmacenServicio } from '../../../services/almacen.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlmacenDTO } from '../../../interfaces/almacen/almacenDTO.interface';
import Swal from 'sweetalert2';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { CustomValidators } from '../../../validators/validadores';

@Component({
  selector: 'add-almacen',
  templateUrl: './add-almacen.component.html',
  styleUrls: ['./add-almacen.component.css']
})
export class AddAlmacenComponent {

  // FORMULARIO ALMACEN
  public almacenForm: FormGroup;

  // CONSTRUCTOR
  constructor(private almacenServicio: AlmacenServicio, private fb: FormBuilder) {
    this.almacenForm = this.fb.group({
      idEstanteria: [0, [Validators.required, Validators.min(1)], CustomValidators.estanteriaExistente(this.almacenServicio)],
      cantidad: [0, [Validators.required, Validators.min(1)]],
    });

    this.almacenForm.get('idEstanteria')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe();
  }

  // VALOR DEL FORMULARO DE ALMACEN
  get Almacen(): AlmacenDTO {
    return this.almacenForm.value as AlmacenDTO;
  }



  // AÑADIR A ALMACEN
  addAlmacen() {
    if (this.almacenForm.invalid) {
      this.almacenForm.markAllAsTouched();
      return;
    }

    this.almacenServicio.addAlmacen(this.Almacen)
      .subscribe(
        () => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Añadido al almacén correctamente",
            showConfirmButton: false,
            timer: 1500
          });
          this.almacenForm.reset({
            idEstanteria: 0,
            cantidad: 0
          });
        },
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

  isValidField(field: string): boolean | null {
    return this.almacenForm.controls[field].errors
    && this.almacenForm.controls[field].touched;
  }

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

    if (field === 'idEstanteria' && errors['estanteriaNotFound']) {
      return 'No existe ninguna estantería con ese id';
    }

    return null;
  }
}
