import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LayoutAuthComponent } from './pages/layout-auth/layout-auth.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutAuthComponent,
    children: [
      { path: 'login', component: LoginPageComponent},
      { path: '**', redirectTo: 'login'}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
