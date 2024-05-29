import { Component } from '@angular/core';
import { StockService } from '../../../services/stocks.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockDTO } from '../../../interfaces/stock/stockDTO.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent {

  public stockForm: FormGroup;

  constructor(private stockService: StockService, private fb: FormBuilder) {
    this.stockForm = this.fb.group({
      idShelf: [0, [Validators.required]],
      amount: [0, [Validators.required]],
    });
  }

  get currentStock(): StockDTO {
    return this.stockForm.value as StockDTO;
  }

  addStock(){

    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }

    this.stockService.addStock(this.currentStock)
      .subscribe(
        () => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Stock correctamente añadido",
            showConfirmButton: false,
            timer: 1500
          });
          this.stockForm.reset({
            idProfile: 0,
            amount: 0
          });
        },
        error => {
          console.error('Error al añadir stock:', error);
        }
      );
  }

  isValidField(field: string): boolean | null {
    return this.stockForm.controls[field].errors && this.stockForm.controls[field].touched;
  }

  getFieldError(field: string): string | null {
    const control = this.stockForm.get(field);
    if (!control) return null;

    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'email':
          return 'Correo electrónico inválido';
      }
    }
    return null;
  }
}
