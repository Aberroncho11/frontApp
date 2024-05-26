import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  imports: [
    SharedModule,
    MaterialModule
  ],
    declarations: [
    LandingPageComponent
  ],
  providers: [],
})
export class StoreModule { }
