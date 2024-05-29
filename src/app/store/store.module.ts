import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreRoutingModule } from './store-routing.module';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AppComponent } from '../app.component';
import { ArticlePageComponent } from './pages/article-page/article-page.component';
import { CrearArticuloComponent } from './components/articulos/crear-articulo/crear-articulo.component';
import { EliminarArticuloComponent } from './components/articulos/eliminar-articulo/eliminar-articulo.component';
import { ModificarArticuloComponent } from './components/articulos/modificar-articulo/modificar-articulo.component';
import { VerArticulosComponent } from './components/articulos/ver-articulos/ver-articulos.component';
import { LayoutStoreComponent } from './pages/layout-store/layout-store.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerPedidosComponent } from './components/pedidos/ver-pedidos/ver-pedidos.component';
import { CrearPedidoComponent } from './components/pedidos/crear-pedido/crear-pedido.component';
import { PedidosComponent } from './pages/pedidos-page/pedidos-page.component';
import { CrearUsuarioComponent } from './components/usuarios/crear-usuario/crear-usuario.component';
import { VerUsuariosComponent } from './components/usuarios/ver-usuarios/ver-usuarios.component';
import { EliminarUsuarioComponent } from './components/usuarios/eliminar-usuario/eliminar-usuario.component';
import { ModificarUsuarioComponent } from './components/usuarios/modificar-usuario/modificar-usuario.component';
import { UsuariosPageComponent } from './pages/usuarios-page/usuarios-page.component';
import { StockPageComponent } from './pages/stock-page/stock-page.component';
import { AddStockComponent } from './components/stocks/add-stock/add-stock.component';




@NgModule({
  imports: [

    CommonModule,

    StoreRoutingModule,

    ReactiveFormsModule,

    FormsModule,

  ],
    declarations: [

    LandingPageComponent,

    PedidosComponent,

    LayoutStoreComponent,

    FooterComponent,

    ArticlePageComponent,

    CrearArticuloComponent,

    EliminarArticuloComponent,

    ModificarArticuloComponent,

    VerArticulosComponent,

    VerPedidosComponent,

    CrearPedidoComponent,

    CrearUsuarioComponent,

    VerUsuariosComponent,

    EliminarUsuarioComponent,

    ModificarUsuarioComponent,

    UsuariosPageComponent,

    StockPageComponent,

    AddStockComponent,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class StoreModule { }
