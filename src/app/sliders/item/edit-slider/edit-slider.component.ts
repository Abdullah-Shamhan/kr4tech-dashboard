import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/app.reducer';
import { EditSlidersService } from 'src/app/services/edit-slider.service';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { Slider } from 'src/app/models/slider';
import idGenerator from 'src/app/shared/idGenerator/idGenerator';
import { sortByDate } from 'src/app/shared/listSorting';

@Component({
  selector: 'app-edit-slider',
  templateUrl: './edit-slider.component.html',
  styleUrls: ['./edit-slider.component.css']
})
export class EditSliderComponent implements OnInit {

  @Input('slider') slider : Slider;

  constructor(private store: Store<fromApp.appState> , private editSliderSrvs: EditSlidersService ,  private upload : UploadFileService   ) { }

  isUploading= false;
  sliderName = "";
  storeSub : Subscription;
  pagesList = [];
  sliderForm: FormGroup;
  image ;
  sliderContent = []; 
  fileName = 'Choose image';
  currentPageId = null;
  sliderId = '';

  ngOnInit(): void {

    this.formInit();

    this.storeSub = this.store.select('page').subscribe((pages ) => {

      this.pagesList = [...pages.availablePages].sort(sortByDate);


    });


    this.sliderName = this.slider.name;
    this.sliderContent = [...this.slider.content];
    this.sliderId = this.slider.id;
    this.editSliderSrvs.content.emit([...this.sliderContent]);
    this.editSliderSrvs.sliderName.emit(this.sliderName);

  }

  formInit = () => {

    this.sliderForm = new FormGroup({
      slideName : new FormControl('' , [Validators.required]),
      importFile: new FormControl('', Validators.required),
      navTo : new FormControl('', Validators.required)
    });

    
  }

  onRset(){

    this.sliderForm.reset();
    this.image = null;
    this.currentPageId = '';
    this.fileName = 'Choose image';
   

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

  onRowClick = index => {
  
    const selectedPage = this.pagesList[index];
  
     if (this.currentPageId !== this.pagesList[index].id){
  
      this.currentPageId = this.pagesList[index].id;
       this.sliderForm.get('navTo').setValue(selectedPage);
    }
  
  
  }

  onSubmit () {

    this.isUploading =true;
    const id = idGenerator();
    this.sliderForm.disable();
    const path = 'sliders/' + this.sliderId + '/' +  new Date().getTime()  + '_' + this.image.name ;

    this.upload.uploadSingleImage(this.image , path).then(url => {

      const sliderItem = {
        id: id,
        slideName: this.sliderForm.get('slideName').value,
        navTo: this.sliderForm.get('navTo').value,
        image: url
      }
  
      this.sliderContent.push(sliderItem);
      this.editSliderSrvs.content.emit([...this.sliderContent]);
      this.editSliderSrvs.contentValidatiy.emit(this.sliderContent.length === 0 ? false : true);
      

      this.onRset();
      this.isUploading = false;
      this.sliderForm.enable();

    }).catch(err => {
      alert(err);
    })

  
  }


  onRemove(index){

    this.sliderContent.splice(index , 1);
    this.editSliderSrvs.content.emit([...this.sliderContent]);
    this.editSliderSrvs.contentValidatiy.emit(this.sliderContent.length === 0 ? false : true);
  }

  changeSliderName(val){

    if(this.sliderName === ''){
      this.editSliderSrvs.sliderNameValidity.emit(false);
      this.editSliderSrvs.sliderName.emit();
    } else {
      this.editSliderSrvs.sliderNameValidity.emit(true);
      this.editSliderSrvs.sliderName.emit(this.sliderName);
    }

  }
}
