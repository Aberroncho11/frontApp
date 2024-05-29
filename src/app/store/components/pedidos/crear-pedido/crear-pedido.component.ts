import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, switchMap, map, first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { OrderService } from '../../../services/orders.service';
import { UserService } from '../../../services/users.service';
import { ArticleService } from '../../../services/articles.service';
import { OrderCreacionDTO } from '../../../interfaces/order/orderCreacionDTO.interface';
import { CustomValidators } from '../../../validators/custom-validators';

@Component({
  selector: 'crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrls: ['./crear-pedido.component.css']
})
export class CrearPedidoComponent {

  public pedidoForm: FormGroup;
  public newArticulo: FormGroup;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private articleService: ArticleService,
    private fb: FormBuilder
  ) {
    this.pedidoForm = this.fb.group({
      idUser: ['', [Validators.required]],
      postalCode: ['', [Validators.required, CustomValidators.postalCodeValidator]],
      town: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, CustomValidators.phoneNumberValidator]],
      personalContact: ['', [Validators.required]],
      address: ['', [Validators.required]],
      province: ['', [Validators.required]],
      articles: this.fb.array([], Validators.required)
    });

    this.newArticulo = this.fb.group({
      idArticle: ['', [Validators.required], [this.articleExistsValidator()]],
      quantity: ['', Validators.required]
    });
  }

  get currentPedido(): OrderCreacionDTO {
    return this.pedidoForm.value as OrderCreacionDTO;
  }

  get articles(): FormArray {
    return this.pedidoForm.get('articles') as FormArray;
  }

  crearPedido(): void {
    if (this.pedidoForm.invalid) {
      this.pedidoForm.markAllAsTouched();
      return;
    }

    this.orderService.addPedido(this.currentPedido)
      .subscribe(response => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Pedido correctamente creado",
          showConfirmButton: false,
          timer: 1500
        });
        this.pedidoForm.reset();
        this.pedidoForm.patchValue({
          idUser: '',
          postalCode: '',
          phoneNumber: ''
        });
        this.articles.clear();

      }, error => {
        console.error('Error al crear pedido:', error);
      });
  }

  odAddToArticulos(): void {
    if (this.newArticulo.invalid) {
      this.newArticulo.markAllAsTouched();
      return;
    }

    const idArticle = this.newArticulo.get('idArticle')?.value;
    const quantity = this.newArticulo.get('quantity')?.value;

    this.articleService.getArticlesPorId(idArticle).subscribe(
      article => {
        if (article) {
          this.articles.push(this.fb.group({
            idArticle: [idArticle, Validators.required],
            quantity: [quantity, Validators.required]
          }));
          this.newArticulo.reset();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No existe ningún artículo con este ID',
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
    this.articles.removeAt(index);
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
        case 'userNotFound':
          return 'No existe ningún usuario con este id';
      }
    }
    return null;
  }

  getArticleFieldError(field: string): string | null {
    const control = this.newArticulo.get(field);
    if (!control) return null;

    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'articleNotFound':
          return `No existe ningún usuario con el id ${this.currentPedido.idUser}`;
      }
    }
    return null;
  }

  userExistsValidator(): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return control.valueChanges.pipe(
        debounceTime(1000),
        first(),
        switchMap(value => this.userService.getUserPorId(value).pipe(
          map(user => (user ? null : { userNotFound: true })),
          catchError(() => of({ userNotFound: true }))
        ))
      );
    };
  }

  articleExistsValidator(): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return this.articleService.getArticlesPorId(control.value).pipe(
        map(article => (article ? null : { articleNotFound: true })),
        catchError(() => of({ articleNotFound: true }))
      );
    };
  }

}
