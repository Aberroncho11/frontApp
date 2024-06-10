import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AlmacenServicio } from '../store/services/almacen.service';
import { Observable, catchError, map, of } from 'rxjs';
import { ArticuloServicio } from '../store/services/articulo.service';
import { UsuarioServicio } from '../store/services/usuario.service';

export class CustomValidators {

  // Validador de correo electrónico
  static postalCodeValidator: ValidatorFn = (control: AbstractControl) => {
    // Expresión regular para validar el código postal
    const postalCodePattern = /^[0-5][0-9]{4}$/;
    // Si el código postal no cumple con la expresión regular
    if (!postalCodePattern.test(control.value)) {
      return { invalidPostalCode: true };
    }
    return null;
  };

  // Validador de número de teléfono
  static phoneNumberValidator: ValidatorFn = (control: AbstractControl) => {
    // Expresión regular para validar el número de teléfono
    const phoneNumberPattern = /^[0-9]{9}$/;
    // Si el número de teléfono no cumple con la expresión regular
    if (!phoneNumberPattern.test(control.value)) {
      return { invalidPhoneNumber: true };
    }
    return null;
  };

  // Validador de contraseña
  static passwordValidator: ValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
    // Retornar un observable
    return new Observable((observer) => {
      // Obtener la contraseña
      const password = control.value;
      // Validar si la contraseña tiene al menos una mayúscula, una minúscula y un número
      const hasUpperCase = /[A-Z]/.test(password);
      // Validar si la contraseña tiene al menos una minúscula
      const hasLowerCase = /[a-z]/.test(password);
      // Validar si la contraseña tiene al menos un número
      const hasNumber = /\d/.test(password);

        // Si la contraseña no cumple con los requisitos
        if (!hasUpperCase || !hasLowerCase || !hasNumber) {
          observer.next({ invalidPassword: true });
        // Si la contraseña cumple con los requisitos
        } else {
          observer.next(null);
        }
        observer.complete();

    });
  };


  // Validador de existencia de estantería
  static estanteriaExistente(almacenServicio: AlmacenServicio): (control: AbstractControl) => Observable<ValidationErrors | null> {
    // Retornar un observable
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      // Obtener el id de la estantería
      const idEstanteria = control.value;
      // Si no hay id de estantería o no es un número
      if (!idEstanteria || isNaN(idEstanteria)) {
        return of(null);
      }

      // Obtener la estantería por id
      return almacenServicio.getEstanteriaPorId(idEstanteria).pipe(
        map(() => null),
        catchError(() => {
          // Si no existe la estantería
          console.error(`La estanteria con el id ${idEstanteria} no existe`);
          return of({ 'estanteriaNotFound': true })
        })
      );
    };
  }

  static emailExistsValidator(usuarioServicio: UsuarioServicio): AsyncValidatorFn {
    return (control: AbstractControl) => {
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

  static emailNotExistsValidator(usuarioServicio: UsuarioServicio): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;
      if (!email) {
        return of(null);
      }
      return usuarioServicio.checkEmailNotExists(email).pipe(
        map(exists => (exists ? { emailExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }



  static nicknameExistsValidator(usuarioServicio: UsuarioServicio): AsyncValidatorFn {
    return (control: AbstractControl) => {
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

  // Validador de existencia de artículo
  static articuloExistente(articuloServicio: ArticuloServicio): (control: AbstractControl) => Observable<ValidationErrors | null> {
    // Retornar un observable
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      // Obtener el id del artículo
      const idArticulo = control.value;
      // Si no hay id de artículo o no es un número
      if (!idArticulo) {
        return of(null);
      }

      // Obtener el artículo por id
      return articuloServicio.getArticuloPorId(idArticulo).pipe(
        map(() => null),
        // Si no existe el artículo
        catchError(() => {
          console.error(`El artículo con el id ${idArticulo} no existe`);
          return of({ 'articuloNotFound': true })
        })
      );
    };
  }

  // Validador de existencia de usuario
  static usuarioExistente(usuarioServicio: UsuarioServicio): (control: AbstractControl) => Observable<ValidationErrors | null> {
    // Retornar un observable
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      // Obtener el id del usuario
      const idUsuario = control.value;
      // Si no hay id de usuario o no es un número
      if (!idUsuario || isNaN(idUsuario)) {
        return of(null);
      }

      // Obtener el usuario por id
      return usuarioServicio.getUsuarioPorId(idUsuario).pipe(
        map(() => null),
        // Si no existe el usuario
        catchError(() => {
          console.error(`El usuario con el id ${idUsuario} no existe`);
          return of({ 'usuarioNotFound': true })
        })
      );
    };
  }


}
