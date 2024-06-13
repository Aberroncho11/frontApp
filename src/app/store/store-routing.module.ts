import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutStoreComponent } from './pages/layout-store/layout-store.component';
import { VerArticulosComponent } from './pages/articulo-page/ver-articulos/ver-articulos.component';
import { ModificarArticuloComponent } from './pages/articulo-page/modificar-articulo/modificar-articulo.component';
import { CrearArticuloComponent } from './pages/articulo-page/crear-articulo/crear-articulo.component';
import { EliminarArticuloComponent } from './pages/articulo-page/eliminar-articulo/eliminar-articulo.component';
import { VerPedidosComponent } from './pages/pedidos-page/ver-pedidos/ver-pedidos.component';
import { CrearPedidoComponent } from './pages/pedidos-page/crear-pedido/crear-pedido.component';
import { InicioPageComponent } from './pages/inicio-page/inicio-page.component';
import { AddAlmacenComponent } from './pages/almacen-page/add-almacen/add-almacen.component';
import { VerUsuariosComponent } from './pages/usuarios-page/ver-usuarios/ver-usuarios.component';
import { CrearUsuarioComponent } from './pages/usuarios-page/crear-usuario/crear-usuario.component';
import { ModificarUsuarioComponent } from './pages/usuarios-page/modificar-usuario/modificar-usuario.component';
import { EliminarUsuarioComponent } from './pages/usuarios-page/eliminar-usuario/eliminar-usuario.component';
import { isAdminGuard } from '../auth/guards/is-admin.guard';
import { isAdminOrGestorGuard } from '../auth/guards/is-adminorgestor.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutStoreComponent,
    children: [
      {
        path: 'inicio', component: InicioPageComponent
      },
      {
        path: 'verArticulos', canActivate: [isAdminGuard], component: VerArticulosComponent
      },
      {
        path: 'crearArticulo', canActivate: [isAdminGuard], component: CrearArticuloComponent
      },
      {
        path: 'modificarArticulo', canActivate: [isAdminGuard], component: ModificarArticuloComponent
      },
      {
        path: 'eliminarArticulo', canActivate: [isAdminGuard], component: EliminarArticuloComponent
      },
      {
        path: 'verPedidos', canActivate: [isAdminGuard], component: VerPedidosComponent
      },
      {
        path: 'crearPedido', component: CrearPedidoComponent
      },
      {
        path: 'verUsuarios', canActivate: [isAdminGuard], component: VerUsuariosComponent
      },
      {
        path: 'crearUsuario', canActivate: [isAdminGuard], component: CrearUsuarioComponent
      },
      {
        path: 'modificarUsuario', canActivate: [isAdminGuard], component: ModificarUsuarioComponent
      },
      {
        path: 'eliminarUsuario', canActivate: [isAdminGuard], component: EliminarUsuarioComponent
      },
      {
        path: 'addAlmacen', canActivate: [isAdminOrGestorGuard], component: AddAlmacenComponent
      },
      {
        path: '', redirectTo: '/store/inicio', pathMatch: 'full'
      },
      {
        path: '**', redirectTo: '/404'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
