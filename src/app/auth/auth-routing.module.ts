import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LayoutAuthComponent } from './pages/layout-auth/layout-auth.component';

// Define routes
const routes: Routes = [
  {
    // Ruta padre
    path: '',
    // Componente padre
    component: LayoutAuthComponent,
    // Rutas hijas
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
