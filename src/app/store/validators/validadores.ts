import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AlmacenServicio } from '../services/almacen.service';
import { Observable, catchError, map, of } from 'rxjs';
import { ArticuloServicio } from '../services/articulo.service';
import { UsuarioServicio } from '../services/usuario.service';

export class CustomValidators {

  // VALIDADOR DE CÓDIGO POSTAL
  static postalCodeValidator: ValidatorFn = (control: AbstractControl) => {
    const postalCodePattern = /^[0-5][0-9]{4}$/;
    if (!postalCodePattern.test(control.value)) {
      return { invalidPostalCode: true };
    }
    return null;
  };

  // VALIDADOR DE NÚMERO DE TELÉFONO
  static phoneNumberValidator: ValidatorFn = (control: AbstractControl) => {
    const phoneNumberPattern = /^[0-9]{9}$/;
    if (!phoneNumberPattern.test(control.value)) {
      return { invalidPhoneNumber: true };
    }
    return null;
  };
  static articleExistsValidator: any | string;

  // VALIDADOR DE EXISTENCIA DE NÚMERO DE ESTANTERÍA
  static estanteriaExistente(almacenServicio: AlmacenServicio): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const idEstanteria = control.value;
      if (!idEstanteria || isNaN(idEstanteria)) {
        return of(null);
      }

      return almacenServicio.getEstanteriaPorId(idEstanteria).pipe(
        map(() => null),
        catchError(() => {
          console.error(`La estanteria con el id ${idEstanteria} no existe`);
          return of({ 'estanteriaNotFound': true })
        })
      );
    };
  }

  // VALIDADOR DE EXISTENCIA DE ARTÍCULO
  static articuloExistente(articuloServicio: ArticuloServicio): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const idArticulo = control.value;
      if (!idArticulo || isNaN(idArticulo)) {
        return of(null);
      }

      return articuloServicio.getArticuloPorId(idArticulo).pipe(
        map(() => null),
        catchError(() => {
          console.error(`El artículo con el id ${idArticulo} no existe`);
          return of({ 'articuloNotFound': true })
        })
      );
    };
  }

  // VALIDADOR DE EXISTENCIA DE USUARIO
  static usuarioExistente(usuarioServicio: UsuarioServicio): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const idUsuario = control.value;
      if (!idUsuario || isNaN(idUsuario)) {
        return of(null);
      }

      return usuarioServicio.getUsuarioPorId(idUsuario).pipe(
        map(() => null),
        catchError(() => {
          console.error(`El usuario con el id ${idUsuario} no existe`);
          return of({ 'usuarioNotFound': true })
        })
      );
    };
  }
}
