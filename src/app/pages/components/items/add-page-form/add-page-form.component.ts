import { Component, OnInit, OnDestroy  } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Page } from 'src/app/models/page';
import { Subscription } from 'rxjs';
import idGenerator from 'src/app/shared/idGenerator/idGenerator';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/app.reducer';;
import * as pageActions from 'src/app/store/addPage/newPage.actions';

@Component({
  selector: 'app-add-page-form',
  templateUrl: './add-page-form.component.html',
  styleUrls: ['./add-page-form.component.css']
})
export class AddPageFormComponent implements OnInit , OnDestroy {

  newPageForm: FormGroup;
  image: File = null;
  fileName: String = 'Choose image/logo';
  color: string = '#fff';

  formSub : Subscription;
  validitySub: Subscription;
  formIsValid  = false;
  productIdVisiblity = 'hidden';

  constructor(private store: Store<fromApp.appState>) {}

  ngOnInit() {

    this.formInit();

    this.formSub = this.newPageForm.get('isFree').valueChanges.subscribe(val => {
     
      if (val === 'paid') {
          this.newPageForm.controls['productCodeIOS'].setValidators([Validators.required]);
          this.newPageForm.controls['productCodeANDROID'].setValidators([Validators.required]);
          this.productIdVisiblity = 'visible' ;

      } else {
        this.newPageForm.controls['productCodeIOS'].clearValidators();
        this.newPageForm.controls['productCodeANDROID'].clearValidators();
        this.productIdVisiblity = 'hidden';
      }
      this.newPageForm.controls['productCodeIOS'].updateValueAndValidity();
      this.newPageForm.controls['productCodeANDROID'].updateValueAndValidity();


  });

  this.store.select('addPage').subscribe(state => {
    this.formIsValid = state.pageIsValid;
  });

  this.validitySub =  this.newPageForm.statusChanges.subscribe(validity => {

    if(validity === 'VALID') {
     this.store.dispatch(new pageActions.addPage(this.onSubmit()));
    } else if (validity === 'INVALID' && this.formIsValid === true) {
      this.store.dispatch(new pageActions.invalidPage());
    }
    

  });

  }

  formInit = () => {

    this.newPageForm = new FormGroup({
      enTitle: new FormControl('' , [Validators.required] ),
      arTitle: new FormControl('' , [Validators.required]),
      enDescription: new FormControl('', [Validators.required] ),
      arDescription: new FormControl('' , [Validators.required]),
      buttonType: new FormControl('' , [Validators.required]),
      buttonSize: new FormControl('' , [Validators.required]),
      importFile: new FormControl('' , [Validators.required]),
      buttonColor: new FormControl(this.color , [Validators.required]),
      isFree: new FormControl('' , [Validators.required]),
      pageType: new FormControl('' , [Validators.required]),
      productCodeIOS: new FormControl(''),
      productCodeANDROID: new FormControl(''),
    });



  }

  onFileChange(file: File) {

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

  onSubmit = () => {

    const id = idGenerator();
    const pageType = this.newPageForm.get('pageType').value;

    const page = new Page(
      id ,
      this.newPageForm.get('enTitle').value,  
      this.newPageForm.get('arTitle').value,  
      this.newPageForm.get('enDescription').value,  
      this.newPageForm.get('arDescription').value,  
      this.newPageForm.get('buttonType').value,  
      this.newPageForm.get('buttonSize').value,  
      this.newPageForm.get('buttonColor').value, 
      this.image,  
      this.newPageForm.get('isFree').value,
      pageType ,
      this.newPageForm.get('productCodeIOS').value,
      this.newPageForm.get('productCodeANDROID').value
    
      );
      return page;

  }

  onColorChange(){

    this.newPageForm.get('buttonColor').setValue(this.color);

  }

  ngOnDestroy = () => {

    if (this.formSub){
    this.formSub.unsubscribe();
  }

    if(this.validitySub){
      this.validitySub.unsubscribe();
    }

  }
 

}
