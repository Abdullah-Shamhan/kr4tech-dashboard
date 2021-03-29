import { Component, OnInit, OnDestroy, HostListener, Input   } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import idGenerator from 'src/app/shared/idGenerator/idGenerator';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/app.reducer';
import { addPageContent, startUploading, finishUploading, invalidPage } from 'src/app/store/addPage/newPage.actions';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EditPageService } from 'src/app/services/edit-page.service';

@Component({
  selector: 'app-add-gallery-content',
  templateUrl: './add-gallery-content.component.html',
  styleUrls: ['./add-gallery-content.component.css']
})
export class AddGalleryContentComponent implements OnInit , OnDestroy {

  @Input('content') editContent : [];
  @Input('editedPageId') editedPageId : string;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if(!this.editContent)
    this.store.dispatch(new invalidPage);
  }





  galleryForm: FormGroup;
  images = [];
  galleryContent = []; 
  fileName: String = 'Choose images';
  isUploading = false;
  storeSub : Subscription;
  editItem = null;
  editIndex = null;

  constructor(private store: Store<fromApp.appState> , private upload: UploadFileService , 
    private route: ActivatedRoute , private editPageService: EditPageService) {}

  formInit () {

    this.galleryForm = new FormGroup({
      enTitle : new FormControl('' , [Validators.required]),
      arTitle : new FormControl('' , [Validators.required]),
      enDescription : new FormControl('' , [Validators.required]),
      arDescription : new FormControl('' , [Validators.required]),
      importFile: new FormControl('', Validators.required)
    });



  }


  ngOnInit() {

    this.formInit();

    this.storeSub = this.store.select('addPage').subscribe(state => {

      this.isUploading = state.isUploading;


      if(this.isUploading){
        this.galleryForm.disable();
      } else {
        this.galleryForm.enable();
      }

    });

      if(this.editContent){
        this.galleryContent = [...this.editContent];
        this.editPageService.content.emit([...this.editContent]);
      }
  }

  onFileChange(files: FileList ) {

    if (files != undefined){
    Array.from(files).forEach(file => {

      if(file.type === "image/png" || file.type === "image/jpeg"  ) {
        this.images.push(file);

      } else {
        alert('Only png, jpeg and jpg images are supported!!')
      }


    });

    this.fileName = 'Number of images: ' + this.images.length.toString();
  }

}


  onSubmit () {

   
    

    let pageId;
    if(!this.editedPageId){
     pageId  = this.route.snapshot.params['id'];
    } else {
      pageId = this.editedPageId;
    }
    const id  = this.editItem ? this.editItem.id : idGenerator();

     if(this.images.length > 0){
    this.store.dispatch(new startUploading());
    this.upload.uploadMultipleImages(this.images , pageId , id ).then(val => {

      const galleryItem = {
        id: id , 
        enTitle : this.galleryForm.get('enTitle').value, 
        arTitle : this.galleryForm.get('arTitle').value, 
        enDescription : this.galleryForm.get('enDescription').value, 
        arDescription : this.galleryForm.get('arDescription').value, 
        images : val
      }
   
      if(this.editItem){
        this.galleryContent[this.editIndex] = galleryItem;
      } else {
        this.galleryContent.push(galleryItem);
      }

      if(this.editContent){
        this.editPageService.content.emit([...this.galleryContent]);
        this.editPageService.contentValidatiy.emit(this.galleryContent.length > 0 ? true : false);
       } else {
        this.store.dispatch(new addPageContent([...this.galleryContent]));
      }

     
       this.onRset();


      
      this.store.dispatch(new finishUploading());
    }).catch(err => {
      alert(err);
    })
    }
    else {

      const galleryItem = {
        id: id , 
        enTitle : this.galleryForm.get('enTitle').value, 
        arTitle : this.galleryForm.get('arTitle').value, 
        enDescription : this.galleryForm.get('enDescription').value, 
        arDescription : this.galleryForm.get('arDescription').value, 
        images : this.editItem.images
      }
   
      
      if(this.editItem){
        this.galleryContent[this.editIndex] = galleryItem;
      } else {
        this.galleryContent.push(galleryItem);
      }

      if(this.editContent){
        this.editPageService.content.emit([...this.galleryContent]);
        this.editPageService.contentValidatiy.emit(this.galleryContent.length > 0 ? true : false);
       } else {
        this.store.dispatch(new addPageContent([...this.galleryContent]));
      }

     
       this.onRset();
    }

  }


  onRemoveItem = index => {
    if(!this.editItem){
    this.galleryContent.splice(index , 1);
    if(this.editContent){
      this.editPageService.content.emit([...this.galleryContent]);
      this.editPageService.contentValidatiy.emit(this.galleryContent.length > 0 ? true : false);
     } else {
      this.store.dispatch(new addPageContent([...this.galleryContent]));
    }
  } else {
    alert('Deleteing not available while editing item!!');
  }

  }

  onRset () {
    this.galleryForm.reset();
    this.fileName = 'Choose images';
    this.images = [];
    this.editIndex = null;
    this.editItem = null;
  }

  ngOnDestroy(){
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

  onEditItem(index){
    this.editIndex = index;
    this.editItem = this.galleryContent[index];
  
    this.galleryForm.get('enTitle').setValue(this.editItem.enTitle);
    this.galleryForm.get('arTitle').setValue(this.editItem.arTitle);
    this.galleryForm.get('enDescription').setValue(this.editItem.enDescription);
    this.galleryForm.get('arDescription').setValue(this.editItem.arDescription);
    this.fileName = 'Leave this to use the same images';
    
  }


}
