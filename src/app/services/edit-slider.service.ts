import { Injectable, EventEmitter } from '@angular/core';
import { Slider } from '../models/slider';

@Injectable({
  providedIn: 'root'
})
export class EditSlidersService {

  constructor() { }

  sliderName = new EventEmitter<string>();
  content = new EventEmitter<any[]>();
  sliderNameValidity = new EventEmitter<boolean>(true);
  contentValidatiy = new EventEmitter<boolean>(true);


  cancel(){

  this.sliderName.emit();
  this.content.emit([]);
  this.sliderNameValidity.emit(true);
  this.contentValidatiy.emit(true);


  }

  
}
