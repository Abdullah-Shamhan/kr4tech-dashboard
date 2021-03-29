import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SlidersComponent } from './components/sliders/sliders.component';
import { AddSliderComponent } from './components/add-slider/add-slider.component';





const routes: Routes = [
    {path: '' , component: SlidersComponent},
    {path: 'add-slider' , component: AddSliderComponent},
]

@NgModule({
    imports :[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class slidersRoutingModule{}

