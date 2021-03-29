import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import idGenerator from 'src/app/shared/idGenerator/idGenerator';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/app.reducer';
import { Subscription , combineLatest } from 'rxjs';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { Slider } from 'src/app/models/slider';
import { postSlider } from 'src/app/store/sliders/sliders.actions';
import { sortByDate } from 'src/app/shared/listSorting';

@Component({
  selector: 'app-add-slider',
  templateUrl: './add-slider.component.html',
  styleUrls: ['./add-slider.component.css']
})
export class AddSliderComponent implements OnInit {

  constructor(private store: Store<fromApp.appState> , private upload : UploadFileService) { }

  pagesList = [];
  sliderForm: FormGroup;
  image ;
  sliderContent = []; 
  fileName = 'Choose image';
  buttonTitle = 'NEXT';
  currentPageId = null;
  mode = 'content';
  sliderName = "";
  storeSub : Subscription;
  currentSelectedPage = null;
  isUploading= false;
  sliderId = idGenerator();
  isLoading = false;
  
  ngOnInit() {

    this.formInit();
    
    this.storeSub = combineLatest([this.store.select('sliders') , this.store.select('page') ]).subscribe(([sliders , pages ]) => {

      this.pagesList = [...pages.availablePages].sort(sortByDate);
      this.isLoading = sliders.isLoading;

    });

  }

  formInit = () => {

    this.sliderForm = new FormGroup({
      slideName : new FormControl('' , [Validators.required]),
      importFile: new FormControl('', Validators.required),
      navTo : new FormControl('', Validators.required)
    });

    
  }

  onSubmit () {

    this.isUploading =true;
    const id = idGenerator();
    this.sliderForm.disable();
    const path = 'sliders/' + this.sliderId + '/' +  new Date().getTime() + '_' + this.image.name  ;

    this.upload.uploadSingleImage(this.image , path).then(url => {

      const sliderItem = {
        id: id,
        slideName: this.sliderForm.get('slideName').value,
        navTo: this.sliderForm.get('navTo').value,
        image: url
      }
  
      this.sliderContent.push(sliderItem);
      this.onRset();
      this.isUploading = false;
      this.sliderForm.enable();

    }).catch(err => {
      alert(err);
    })

  
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




  onRset(){

    this.sliderForm.reset();
    this.image = null;
    this.currentPageId = '';
    this.fileName = 'Choose image';
   

  }

  onRemoveItem(index) {

    this.sliderContent.splice(index , 1);
    console.log(this.sliderContent);

  }


  resetAll(){

    this.sliderName = '';
    this.sliderContent = [];
    this.mode = 'content';
  }

  onNext (){

    if (this.mode === 'content'){
    this.mode = 'details';
    this.buttonTitle = 'SAVE SLIDER';
    } else if (this.mode === 'details'){


      const slider = new Slider(this.sliderId , this.sliderName , new Date().toLocaleDateString() , this.sliderContent );
      this.store.dispatch(new postSlider(slider));
      this.resetAll();

    }

  }


}
