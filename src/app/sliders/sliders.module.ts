import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared/shared.module';
import { RouterModule } from '@angular/router';
import { slidersRoutingModule } from './sliders-routing.module';
import { SlidersComponent } from './components/sliders/sliders.component';
import { AddSliderComponent } from './components/add-slider/add-slider.component';
import { EditSliderComponent } from './item/edit-slider/edit-slider.component';




@NgModule({
  declarations: [
    SlidersComponent,
    AddSliderComponent,
    EditSliderComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    slidersRoutingModule
  ],
  exports: [

  ]
})
export class SlidersModule { }
