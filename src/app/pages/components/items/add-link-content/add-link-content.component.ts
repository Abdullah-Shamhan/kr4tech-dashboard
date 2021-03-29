import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/app.reducer';
import { addPageContent , invalidPage } from 'src/app/store/addPage/newPage.actions';
import { EditPageService } from 'src/app/services/edit-page.service';

@Component({
  selector: 'app-add-link-content',
  templateUrl: './add-link-content.component.html',
  styleUrls: ['./add-link-content.component.css']
})
export class AddLinkContentComponent implements OnInit {

  @Input('content') editContent : string;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if(!this.editContent)
    this.store.dispatch(new invalidPage());
  }

  
  link:string = '';

  constructor(private store: Store<fromApp.appState> , private editPageService: EditPageService) { }

  ngOnInit(): void {


    if(this.editContent){
      this.link = this.editContent;
      this.editPageService.content.emit([this.link]);
    }
  }

 
  onValueChange() {

    const isValid = this.validURL(this.link);

    if (isValid){

      if(this.editContent){
        this.editPageService.content.emit([this.link]);
        this.editPageService.contentValidatiy.emit(true);
      } else {
        this.store.dispatch(new addPageContent([this.link]));
      }

    } else {
      
      if(this.editContent){
        this.editPageService.content.emit();
        this.editPageService.contentValidatiy.emit(false);
      } else {
        this.store.dispatch(new addPageContent([]));
      }
      
    }
    
  }



  validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ 
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
      '(\\#[-a-z\\d_]*)?$','i'); 

    return !!pattern.test(str);
  }

}
