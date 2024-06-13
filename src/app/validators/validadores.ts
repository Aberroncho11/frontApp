import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AlmacenServicio } from '../store/services/almacen.service';
import { Observable, catchError, map, of } from 'rxjs';
import { ArticuloServicio } from '../store/services/articulo.service';
import { UsuarioServicio } from '../store/services/usuario.service';

export class CustomValidators {

  /**
   * Método para validar un código postal
   * @param control
   * @returns {Observable<ValidationErrors | null>}
   * @memberof CustomValidators
   */
  static postalCodeValidator: ValidatorFn = (control: AbstractControl) => {
    const postalCodePattern = /^[0-5][0-9]{4}$/;
    if (!postalCodePattern.test(control.value)) {
      return { invalidPostalCode: true };
    }
    return null;
  };

  /**
   * Método para validar un número de teléfono
   * @param control
   * @returns {Observable<ValidationErrors | null>}
   * @memberof CustomValidators
   */
  static phoneNumberValidator: ValidatorFn = (control: AbstractControl) => {
    const phoneNumberPattern = /^[0-9]{9}$/;
    if (!phoneNumberPattern.test(control.value)) {
      return { invalidPhoneNumber: true };
    }
    return null;
  };

  /**
   * Método para validar la contraseña
   * @param control
   * @returns {Observable<ValidationErrors | null>}
   * @memberof CustomValidators
   */
  static passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return { invalidPassword: true };
    }
    return null;
  };

  /**
   * Método para validar si un email existe
   * @param usuarioServicio
   * @returns {Observable<ValidationErrors | null>}
   * @memberof CustomValidators
   */
  static emailExistsValidator(usuarioServicio: UsuarioServicio): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;
      if (!email) {
        return of(null);
      }
      return usuarioServicio.checkEmail(email).pipe(
        map(exists => (exists ? { emailExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  /**
   * Método para validar si un nickname existe
   * @param usuarioServicio
   * @returns {Observable<ValidationErrors | null>}
   * @memberof CustomValidators
   */
  static nicknameExistsValidator(usuarioServicio: UsuarioServicio): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const nickname = control.value;
      if (!nickname) {
        return of(null);
      }
      return usuarioServicio.checkNickname(nickname).pipe(
        map(exists => (exists ? { nicknameExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  /**
   * Método para validar si un nombre de almacén existe
   * @param articuloServicio
   * @returns {Observable<ValidationErrors | null>}
   */
  static nombreExistsValidator(articuloServicio: ArticuloServicio): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const nombre = control.value;
      if (!nombre) {
        return of(null);
      }
      return articuloServicio.checkNombre(nombre).pipe(
        map(exists => (exists ? { nombreExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }


}
