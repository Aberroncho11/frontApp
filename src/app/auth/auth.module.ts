import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LayoutAuthComponent } from './pages/layout-auth/layout-auth.component';
<<<<<<< HEAD

=======
>>>>>>> 59b1aa5a8531a6d4723640726cdc489bae39059b

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
<<<<<<< HEAD
=======
    LayoutAuthComponent,
>>>>>>> 59b1aa5a8531a6d4723640726cdc489bae39059b
    LoginPageComponent,
    RegisterPageComponent,
    LayoutAuthComponent
  ]
})
export class AuthModule { }
