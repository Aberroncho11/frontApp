import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LayoutStoreComponent } from './pages/layout-store/layout-store.component';
import { ArticlePageComponent } from './pages/article-page/article-page.component';
import { PedidosComponent } from './pages/pedidos-page/pedidos-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutStoreComponent,
    children: [
      { path: 'articles', component: ArticlePageComponent},
      { path: 'pedidos', component: PedidosComponent},
      { path: 'inicio', component: LandingPageComponent},
      { path: '**', redirectTo: 'inicio'}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
