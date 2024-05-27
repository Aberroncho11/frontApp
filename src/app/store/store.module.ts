import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreRoutingModule } from './store-routing.module';
import { FooterComponent } from '../shared/components/footer/footer.component';
<<<<<<< HEAD
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AppComponent } from '../app.component';
import { LayoutStoreComponent } from './pages/layout-store/layout-store.component';
import { ArticlePageComponent } from './pages/article-page/article-page.component';
import { CrearArticuloComponent } from './components/articulos/crear-articulo/crear-articulo.component';
import { EliminarArticuloComponent } from './components/articulos/eliminar-articulo/eliminar-articulo.component';
import { ModificarArticuloComponent } from './components/articulos/modificar-articulo/modificar-articulo.component';
import { VerArticulosComponent } from './components/articulos/ver-articulos/ver-articulos.component';
=======
import { LayoutStoreComponent } from './pages/layout-store/layout-store.component';
>>>>>>> 59b1aa5a8531a6d4723640726cdc489bae39059b



@NgModule({
  imports: [
    CommonModule,
    StoreRoutingModule,
  ],
    declarations: [
    LandingPageComponent,
    LayoutStoreComponent,
<<<<<<< HEAD
    FooterComponent,
    ArticlePageComponent,
    CrearArticuloComponent,
    EliminarArticuloComponent,
    ModificarArticuloComponent,
    VerArticulosComponent
=======
    FooterComponent
>>>>>>> 59b1aa5a8531a6d4723640726cdc489bae39059b
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class StoreModule { }
