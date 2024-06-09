import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { LayoutAuthComponent } from './pages/layout-auth/layout-auth.component';

@NgModule({
  imports: [

    CommonModule,

    AuthRoutingModule,

    ReactiveFormsModule

  ],
  declarations: [

    LayoutAuthComponent,

    LoginPageComponent,

    LayoutAuthComponent,

  ]
})
export class AuthModule { }
