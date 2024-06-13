import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LayoutAuthComponent } from './pages/layout-auth/layout-auth.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutAuthComponent,
    children: [
<<<<<<< HEAD
      {
        path: 'login', component: LoginPageComponent
      },
      {
        path: '', redirectTo: 'login', pathMatch: 'full'
      },
      {
        path: '**', redirectTo: '/404'
      }
=======
      { path: 'login', component: LoginPageComponent},
      { path: '', redirectTo: 'login', pathMatch: 'full'},
      { path: '**', redirectTo: '/404'}
>>>>>>> f03d08c574775c7539a261ca246daa280e009f81
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
