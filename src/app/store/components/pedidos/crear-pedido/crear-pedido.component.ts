import { Component } from '@angular/core';
import { ArticleCreacionDTO } from '../../../interfaces/article/articleCreacionDTO.interface';
import { ArticleService } from '../../../services/articles.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { OrderService } from '../../../services/orders.service';
import { OrderCreacionDTO } from '../../../interfaces/order/orderCreacionDTO.interface';
// import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrls: ['./crear-pedido.component.css']
})
export class CrearPedidoComponent {

  // CREACION DEL FORM PARA CREAR ARTICULO
  public pedidoForm: FormGroup = this.fb.group({
    idUser:    ['', [ Validators.required, Validators.minLength(20) ]],
    postalCode: ['', [ Validators.required, Validators.minLength(6) ]],
    town: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    personalContact: ['', [Validators.required]],
    address: ['', [Validators.required]],
    province: ['', [Validators.required]],
    status: ['', [Validators.required]],
    articles: [[], [Validators.required]],
  });

  public newArticulo: FormControl = new FormControl('', Validators.required);

  // CONSTRUCTOR
  constructor(private orderService: OrderService,
    private fb: FormBuilder) {}

   // COGER ARTICULO DEL FORM
   get currentPedido(): OrderCreacionDTO {

    const pedido = this.pedidoForm.value as OrderCreacionDTO;
    return pedido;

  }

  // COGER ARTICULOS
  get articulos() {
    return this.pedidoForm.get('articulos') as FormArray;
  }

  // CREAR ARTICULO
  crearArticulo(): void {

    if(this.pedidoForm.invalid){
      this.pedidoForm.markAllAsTouched();
      return;
    }

    this.orderService.addPedido(this.currentPedido)
    .subscribe(response => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Artículo correctamente creado",
        showConfirmButton: false,
        timer: 1500
      });
      this.pedidoForm.reset();
      this.pedidoForm.patchValue({
        idUser: 0,
        postalCode: 0,
        phoneNumber: 0
      });
    }, error => {
      console.error('Error al crear artículo:', error);
    });
  }

  // AÑADIR ARTICULOS AL ARRAY
  odAddToArticulos():void {
    if(this.articulos.invalid) return;

    const newArticulo = this.articulos.value;

    // this.favoriteGames.push( new FormControl(newGame, Validators.required))

    this.articulos.push(this.fb.control(newArticulo, Validators.required));

    this.articulos.reset();
  }

  // ELIMINAR ARTICULO DEL ARRAY
  onDeleteArticulo( index: number):void {
    this.articulos.removeAt(index);
  }

  // VERIFICAR CAMPO VALIDO
  isValidField( field: string): boolean | null{

    return this.pedidoForm.controls[field].errors
    && this.pedidoForm.controls[field].touched
  }

  // VERIFICAR ARRAY VALIDO
  isValidFieldInArray(formArray: FormArray, index: number){

    return formArray.controls[index].errors
    && formArray.controls[index].touched
  }

  // OBTENER ERROR DEL CAMPO
  getFieldError(field: string): string | null{

    if(!this.pedidoForm.controls[field]) return null;

    const errors = this.pedidoForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch(key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
      }
    }

    return null;
  }

}
