import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static postalCodeValidator: ValidatorFn = (control: AbstractControl) => {
    const postalCodePattern = /^[0-9]{5}$/; // Patrón para código postal (ejemplo: 12345)
    if (!postalCodePattern.test(control.value)) {
      return { invalidPostalCode: true };
    }
    return null;
  };

  static phoneNumberValidator: ValidatorFn = (control: AbstractControl) => {
    const phoneNumberPattern = /^[0-9]{9}$/; // Patrón para número de teléfono (ejemplo: 123456789)
    if (!phoneNumberPattern.test(control.value)) {
      return { invalidPhoneNumber: true };
    }
    return null;
  };
}
