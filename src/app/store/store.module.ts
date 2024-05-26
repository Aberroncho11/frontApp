import { NgModule } from '@angular/core';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { CommonModule } from '@angular/common';
import { StoreRoutingModule } from './store-routing.module';



@NgModule({
  imports: [
    CommonModule,
    StoreRoutingModule
  ],
    declarations: [
    LandingPageComponent
  ],
  providers: [],
})
export class StoreModule { }
