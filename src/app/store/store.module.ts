import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreRoutingModule } from './store-routing.module';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { InicioPageComponent } from './pages/inicio-page/inicio-page.component';
import { AppComponent } from '../app.component';
import { CrearArticuloComponent } from './pages/articulo-page/crear-articulo/crear-articulo.component';
import { EliminarArticuloComponent } from './pages/articulo-page/eliminar-articulo/eliminar-articulo.component';
import { ModificarArticuloComponent } from './pages/articulo-page/modificar-articulo/modificar-articulo.component';
import { VerArticulosComponent } from './pages/articulo-page/ver-articulos/ver-articulos.component';
import { LayoutStoreComponent } from './pages/layout-store/layout-store.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerPedidosComponent } from './pages/pedidos-page/ver-pedidos/ver-pedidos.component';
import { CrearUsuarioComponent } from './pages/usuarios-page/crear-usuario/crear-usuario.component';
import { VerUsuariosComponent } from './pages/usuarios-page/ver-usuarios/ver-usuarios.component';
import { ModificarUsuarioComponent } from './pages/usuarios-page/modificar-usuario/modificar-usuario.component';
import { CrearPedidoComponent } from './pages/pedidos-page/crear-pedido/crear-pedido.component';
import { AddAlmacenComponent } from './pages/almacen-page/add-almacen/add-almacen.component';
import { EliminarUsuarioComponent } from './pages/usuarios-page/eliminar-usuario/eliminar-usuario.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  imports: [

    CommonModule,

    StoreRoutingModule,

    ReactiveFormsModule,

    FormsModule,

    MatPaginatorModule,

    MatTableModule,

  ],
    declarations: [

    InicioPageComponent,

    LayoutStoreComponent,

    FooterComponent,

    HeaderComponent,

    CrearArticuloComponent,

    EliminarArticuloComponent,

    ModificarArticuloComponent,

    VerArticulosComponent,

    VerPedidosComponent,

    CrearPedidoComponent,

    CrearArticuloComponent,

    CrearUsuarioComponent,

    VerUsuariosComponent,

    ModificarUsuarioComponent,

    AddAlmacenComponent,

    EliminarUsuarioComponent

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class StoreModule { }
