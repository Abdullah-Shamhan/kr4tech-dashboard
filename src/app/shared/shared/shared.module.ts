import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import { BrowserModule } from '@angular/platform-browser';
import { SafePipe } from '../pipes/safe.pipe';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbdModalComponent, NgbdModalContent } from '../popUpModal/popup.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';



@NgModule({
  declarations: [
    SafePipe,
    LoadingSpinnerComponent,

  ],
  imports: [
    CommonModule,
    ColorPickerModule,
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

  ],
  exports : [
    CommonModule,
    ColorPickerModule,
    BrowserModule,
    CommonModule,
    SafePipe,
    ReactiveFormsModule,
    FormsModule,
    LoadingSpinnerComponent

  ]
})
export class SharedModule { }
