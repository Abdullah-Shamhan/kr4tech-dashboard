import { Component, OnInit, OnDestroy, HostListener, Input } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import idGenerator from 'src/app/shared/idGenerator/idGenerator';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/app.reducer';
import { addPageContent, startUploading, finishUploading, invalidPage } from 'src/app/store/addPage/newPage.actions';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { Subscription } from 'rxjs';
import {  ActivatedRoute } from '@angular/router';
import { EditPageService } from 'src/app/services/edit-page.service';
 
@Component({
  selector: 'app-add-catalogue-content',
  templateUrl: './add-catalogue-content.component.html',
  styleUrls: ['./add-catalogue-content.component.css']
})
export class AddCatalogueContentComponent implements OnInit , OnDestroy {

  @Input('content') editContent : [];
  @Input('editedPageId') editedPageId : string;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if(!this.editContent)
    this.store.dispatch(new invalidPage());
  }


  
  catalogueForm: FormGroup;
  catalogueContent = [];
  fileName: String = 'Choose image';
  image: File ;
  isUploading = false;
  storeSub : Subscription;
  editItem = null;
  editIndex = null;

  constructor(private store: Store<fromApp.appState> , private upload: UploadFileService , private route : ActivatedRoute , private editPageService : EditPageService ) { 

  }

  ngOnInit() {
    this.formInit();
    this.catalogueForm.disable();

    this.storeSub = this.store.select('addPage').subscribe(state => {

      this.isUploading = state.isUploading;

      if (this.isUploading) {
        this.catalogueForm.disable()
      } else {
        this.catalogueForm.enable()
      }

    });

    if(this.editContent){
      this.catalogueContent = [...this.editContent];
      this.editPageService.content.emit([...this.editContent]);
    }

  }

  formInit () {

    this.catalogueForm = new FormGroup({
      enTitle : new FormControl('' , [Validators.required]),
      arTitle : new FormControl('' , [Validators.required]),
      enDescription : new FormControl('' , [Validators.required]),
      arDescription : new FormControl('' , [Validators.required]),
      importFile: new FormControl('', [Validators.required])
    });


  }

  
  onFileChange(file: FileList ) {

    if(file[0].size > 210000){
      alert('Image size is more than 200kb and might lead to slow app loading!!');
    }
    
    if(file[0] !== undefined){
      if(file[0].type === "image/png" || file[0].type === "image/jpeg"  ){ 
      this.image = file[0];
      this.fileName = file[0].name;
    } else {
      alert('Only png, jpeg and jpg images are supported!!')
    }
  }
    
  }

  onSubmit () {

    this.store.dispatch(new startUploading());
    const id = this.editItem? this.editItem.id :  idGenerator();
    let pageId;

    if(this.editedPageId){
      pageId = this.editedPageId;
    } else {
      pageId = this.route.snapshot.params['id'];
    }
    
    if(this.image){

      const path = 'images/' + pageId + '/' + new Date().getTime() + '_' + this.image.name  ;
      this.upload.uploadSingleImage(this.image , path ).then(url => {
  
        const catalogueItem = {
          id: id , 
          enTitle : this.catalogueForm.get('enTitle').value, 
          arTitle : this.catalogueForm.get('arTitle').value, 
          enDescription : this.catalogueForm.get('enDescription').value, 
          arDescription : this.catalogueForm.get('arDescription').value, 
          image : url
        }
    
        if(this.editItem){
          this.catalogueContent[this.editIndex] = catalogueItem
        } else {
          this.catalogueContent.push(catalogueItem);
        }
  
        if(this.editContent){
          this.editPageService.content.emit([...this.catalogueContent]);
          this.editPageService.contentValidatiy.emit(this.catalogueContent.length > 0 ? true : false);
        } else {
          this.store.dispatch(new addPageContent([...this.catalogueContent]));
        }
        this.store.dispatch(new finishUploading());
        this.onRset();
  
      }).catch(err => {
        alert(err);
      });


    } else {

      const catalogueItem = {
        id: id , 
        enTitle : this.catalogueForm.get('enTitle').value, 
        arTitle : this.catalogueForm.get('arTitle').value, 
        enDescription : this.catalogueForm.get('enDescription').value, 
        arDescription : this.catalogueForm.get('arDescription').value, 
        image : this.editItem.image
      }
  
      if(this.editItem){
        this.catalogueContent[this.editIndex] = catalogueItem
      } else {
        this.catalogueContent.push(catalogueItem);
      }

      if(this.editContent){
        this.editPageService.content.emit([...this.catalogueContent]);
        this.editPageService.contentValidatiy.emit(this.catalogueContent.length > 0 ? true : false);
      } else {
        this.store.dispatch(new addPageContent([...this.catalogueContent]));
      }
      this.store.dispatch(new finishUploading());
      this.onRset();


    }


  }


  onRemoveItem = index => {

    if(!this.editItem){
    this.catalogueContent.splice(index , 1);
    if(this.editContent){
      this.editPageService.content.emit([...this.catalogueContent]);
      this.editPageService.contentValidatiy.emit(this.catalogueContent.length > 0 ? true : false);
    } else {
      this.store.dispatch(new addPageContent([...this.catalogueContent]));
    }}
    else {
      alert('Deleteing not available while editing item!!')
    }

  }

  onRset () {
    this.catalogueForm.reset();
    this.fileName = 'Choose image';
    this.image = null;
    this.editItem = null;
    this.editIndex = null;
  }


ngOnDestroy(){

  if(this.storeSub){
    this.storeSub.unsubscribe();
  }
}


onEditItem(index) {

  this.editIndex = index;
  this.editItem = this.catalogueContent[index];

  this.catalogueForm.get('enTitle').setValue(this.editItem.enTitle);
  this.catalogueForm.get('arTitle').setValue(this.editItem.arTitle);
  this.catalogueForm.get('enDescription').setValue(this.editItem.enDescription);
  this.catalogueForm.get('arDescription').setValue(this.editItem.arDescription);
  this.fileName = 'Leave this to use the same image';

}

}
