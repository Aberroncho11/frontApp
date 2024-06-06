import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioPostDTO } from '../../../store/interfaces/usuario/usuarioPostDTO.interface';
import { UsuarioServicio } from '../../../store/services/usuario.service';
import { CustomValidators } from '../../../validators/validadores';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioServicio: UsuarioServicio,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nickname: ['', [Validators.required, Validators.minLength(6)], [CustomValidators.nicknameExistsValidator(this.usuarioServicio)]],
      email: ['', [Validators.required, Validators.email], [CustomValidators.emailExistsValidator(this.usuarioServicio)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)], [CustomValidators.passwordValidator]]
    });
  }

  ngOnInit(): void {
    this.registerForm.get('email')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();

    this.registerForm.get('nickname')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();

    this.registerForm.get('password')?.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe();
  }

  get currentUsuario(): UsuarioPostDTO {
    return {...this.registerForm.value, perfil: 1} as UsuarioPostDTO;
  }

  register() {
    this.usuarioServicio.addUsuario(this.currentUsuario)
      .subscribe(
        () => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Registro correcto',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigateByUrl('/auth/login');
        },
        error => {
          console.error('Error al registrarse:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error al registrar el usuario',
          });
        }
      );
  }

  isValidField(field: string): boolean | null {
    return this.registerForm.controls[field].errors &&
      this.registerForm.controls[field].touched;
  }

  getFieldError(field: string): string | null {
    if (!this.registerForm.controls[field]) return null;
    const errors = this.registerForm.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'maxlength':
          return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
      }
    }
    if (field === 'nickname' && errors['nicknameExists']) {
      return `Este nickname ya existe`;
    }
    if (field === 'email' && errors['emailExists']) {
      return `Este email ya existe`;
    }
    if (field === 'password' && errors['invalidPassword']) {
      return `La contraseña debe contener al menos una letra mayúscula, una minúscula y un número`;
    }

    return null;
  }
}
