import { Injectable , EventEmitter } from '@angular/core';
import { FullPage } from '../models/fullPage';

@Injectable({
  providedIn: 'root'
})
export class EditPageService {

  constructor() { }

  page = new EventEmitter<FullPage>();
  content = new EventEmitter<any[]>();
  pageValidity = new EventEmitter<boolean>(true);
  contentValidatiy = new EventEmitter<boolean>(true);
  imageChanged = new EventEmitter<File>()

  cancel(){
    this.page.emit();
    this.content.emit();
    this.pageValidity.emit(true);
    this.contentValidatiy.emit(true);
    this.imageChanged.emit();
  }

}
