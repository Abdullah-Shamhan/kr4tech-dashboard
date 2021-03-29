import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FullPage } from 'src/app/models/fullPage';
import { EditPageService } from 'src/app/services/edit-page.service';


@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit , OnDestroy {

  @Input('page') page : FullPage;

  editPageForm: FormGroup;
  fileName: String = 'Choose image/logo';
  color: string = '#fff';
  formSub : Subscription;
  validitySub: Subscription;
  formIsValid  = false;
  productIdVisiblity = 'hidden';
  
  constructor(private editPageService: EditPageService) { }

  ngOnInit(): void {

    this.formInit();
    this.productIdVisiblity = this.page.isFree === 'paid'? 'visible' : 'hidden';
    this.formSub = this.editPageForm.get('isFree').valueChanges.subscribe(val => {
     
      if (val === 'paid') {
          this.editPageForm.controls['productCodeIOS'].setValidators([Validators.required]);
          this.editPageForm.controls['productCodeANDROID'].setValidators([Validators.required]);
          this.productIdVisiblity = 'visible' ;

      } else {
        this.editPageForm.controls['productCodeIOS'].clearValidators();
        this.editPageForm.controls['productCodeANDROID'].clearValidators();
        this.productIdVisiblity = 'hidden';
      }
      this.editPageForm.controls['productCodeIOS'].updateValueAndValidity();
      this.editPageForm.controls['productCodeANDROID'].updateValueAndValidity();


  });

  
  this.validitySub =  this.editPageForm.statusChanges.subscribe(validity => {

    if(validity === 'VALID') {

      this.editPageService.page.emit(this.validPage());
      this.editPageService.pageValidity.emit(true);
    } else if (validity === 'INVALID' ) {
      this.editPageService.page.emit(this.validPage());
      this.editPageService.pageValidity.emit(false);
     
    }
    
  

  });

  this.editPageService.page.emit(this.page);
  
  }


  formInit = () => {

    this.editPageForm = new FormGroup({
      enTitle: new FormControl(this.page.enTitle , [Validators.required] ),
      arTitle: new FormControl(this.page.arTitle , [Validators.required]),
      enDescription: new FormControl(this.page.enDescription, [Validators.required] ),
      arDescription: new FormControl(this.page.arDescription , [Validators.required]),
      buttonType: new FormControl(this.page.buttonType , [Validators.required]),
      buttonSize: new FormControl(this.page.buttonSize , [Validators.required]),
      importFile: new FormControl('' ),
      imageUrl: new FormControl({ value: this.page.imageUrl , disabled : true}  ),
      buttonColor: new FormControl(this.page.buttonColor , [Validators.required]),
      isFree: new FormControl(this.page.isFree , [Validators.required]),
      productCodeIOS: new FormControl(this.page.productCodeIOS),
      productCodeANDROID: new FormControl(this.page.productCodeANDROID),
    });

    this.color = this.page.buttonColor;
    this.editPageService.page.next(this.validPage());
  }

  onFileChange(file: File) {

    if(file[0].size > 210000){
      alert('Image size is more than 200kb and might lead to slow app loading!!');
    }
    
    if(file[0] !== undefined){
    if(file[0].type === "image/png" || file[0].type === "image/jpeg"  ){ 
    this.fileName = file[0].name;
    this.editPageService.imageChanged.emit(file[0]);
  } else {
    alert('Only png, jpeg and jpg images are supported!!')
  }
}
}

viewImgae(){

  window.open(this.page.imageUrl, "_blank");
  return false;

}

validPage = () => {

  const page = new FullPage(
    this.page.id ,
    this.editPageForm.get('enTitle').value,  
    this.editPageForm.get('arTitle').value,  
    this.editPageForm.get('enDescription').value,  
    this.editPageForm.get('arDescription').value,  
    this.editPageForm.get('buttonType').value,  
    this.editPageForm.get('buttonSize').value,  
    this.color,  
    this.page.imageUrl,  
    this.editPageForm.get('isFree').value,
    this.page.pageType ,
    this.page.content,
    this.page.dateAdded,
    this.editPageForm.get('productCodeIOS').value,
    this.editPageForm.get('productCodeANDROID').value
  
    );

    return page;

}

onColorChange(){
  this.editPageService.page.emit(this.validPage());
}

ngOnDestroy(){

  if(this.formSub)
  this.formSub.unsubscribe();

  if(this.validitySub)
  this.validitySub.unsubscribe();

}


}
