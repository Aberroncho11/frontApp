import { NgModule } from '@angular/core';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { CommonModule } from '@angular/common';
import { StoreRoutingModule } from './store-routing.module';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { LayoutStoreComponent } from './pages/layout-store/layout-store.component';



@NgModule({
  imports: [
    CommonModule,
    StoreRoutingModule,
  ],
    declarations: [
    LandingPageComponent,
    LayoutStoreComponent,
    FooterComponent
  ],
  providers: [],
})
export class StoreModule { }
