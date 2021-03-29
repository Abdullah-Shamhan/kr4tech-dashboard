import { Component, OnInit, HostListener, Input,  } from '@angular/core';
import { FormGroup , FormControl, FormArray, Validators } from '@angular/forms';
import idGenerator from 'src/app/shared/idGenerator/idGenerator';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/app.reducer';
import { addPageContent, invalidPage } from 'src/app/store/addPage/newPage.actions';
import { EditPageService } from 'src/app/services/edit-page.service';


@Component({
  selector: 'app-add-form-content',
  templateUrl: './add-form-content.component.html',
  styleUrls: ['./add-form-content.component.css']
})
export class AddFormContentComponent implements OnInit {

  @Input('content') editContent : [];

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if(!this.editContent)
    this.store.dispatch(new invalidPage());
  }



  fromContent: FormGroup;
  inputType = 'textInput';
  formContentList = [];
  editItem  = null;
  editindex  = null;
  
  constructor(private store: Store<fromApp.appState> , private editPageService: EditPageService) { }

  ngOnInit() {

    this.formInit();
    
    if(this.editContent){

      this.formContentList = [...this.editContent];
      this.editPageService.content.emit(this.editContent);
    }


  }


  formInit = () => {

    const options = new FormArray([]);
    options.push(
      new FormGroup({
        'id' : new FormControl (idGenerator()),
        'enChoice': new FormControl ('' ),
        'arChoice': new FormControl ('' )
      })
    );
    

    this.fromContent = new FormGroup({
      enLabel: new FormControl('' , [Validators.required]),
      arLabel: new FormControl('' , [Validators.required]),
      keyboardType : new FormControl('text'),
      fileType : new FormControl('media'),
      options : options
    });



    
  }


onChange(selectedId) {

    this.inputType = selectedId;

    if (this.inputType === 'textInput') {
      this.fromContent.controls['keyboardType'].setValidators([Validators.required]);
    } else {
    this.fromContent.controls['keyboardType'].clearValidators();
    }
    this.fromContent.controls['keyboardType'].updateValueAndValidity();


    this.choicesValidation();

    if (this.inputType === 'fileUpload') {
      this.fromContent.controls['fileType'].setValidators([Validators.required]);
    } else {
    this.fromContent.controls['fileType'].clearValidators();
    }
    this.fromContent.controls['fileType'].updateValueAndValidity();


}


choicesValidation = () => {

  const groupItems = this.fromContent.get("options") as FormArray;

  if (this.inputType === 'checkbox' || this.inputType === 'radioButtons') {

    

    for(let index = 0 ; index < groupItems.length; index++ ) {
      groupItems.at(index).get("enChoice").setValidators(Validators.required);
      groupItems.at(index).get("arChoice").setValidators(Validators.required);
      groupItems.at(index).get("enChoice").updateValueAndValidity();
      groupItems.at(index).get("arChoice").updateValueAndValidity();

      }
    
   } else {

    for(let index = 0 ; index < groupItems.length; index++ ) {
      groupItems.at(index).get("enChoice").clearValidators();
      groupItems.at(index).get("arChoice").clearValidators();
      groupItems.at(index).get("enChoice").updateValueAndValidity();
      groupItems.at(index).get("arChoice").updateValueAndValidity();
      
      }

   }


}


onAdd =() => {

  let formElemetnt ;
  const id = this.editItem ? this.editItem.id : idGenerator();

  if (this.inputType === 'textInput' ){
    formElemetnt = {
      id : id , 
      enLabel : this.fromContent.get('enLabel').value,
      arLabel : this.fromContent.get('arLabel').value,
      type: this.inputType,
      keyboardType : this.fromContent.get('keyboardType').value 
    }

  }  else  if (this.inputType === 'fileUpload' ){
    formElemetnt = {
      id : id , 
      enLabel : this.fromContent.get('enLabel').value,
      arLabel : this.fromContent.get('arLabel').value,
      type: this.inputType,
      fileType : this.fromContent.get('fileType').value 
    }

  }
  else if (this.inputType === 'checkbox' || this.inputType === 'radioButtons'  ) {

    formElemetnt = {
      id : id , 
      enLabel : this.fromContent.get('enLabel').value,
      arLabel : this.fromContent.get('arLabel').value,
      type: this.inputType,
      options : this.fromContent.get('options').value
    }

  }
  else {
    formElemetnt = {
      id : id , 
      enLabel : this.fromContent.get('enLabel').value,
      arLabel : this.fromContent.get('arLabel').value,
      type: this.inputType
    }

  }

  if(this.editItem) {
    this.formContentList[this.editindex] = formElemetnt;
  }else {
    this.formContentList.push(formElemetnt);
  }
  

  this.cancelEditItem();
  if(this.editContent){
    this.editPageService.content.emit([...this.formContentList]);
    if(this.formContentList.length > 0){
      this.editPageService.contentValidatiy.emit(true);
    }else {
      this.editPageService.contentValidatiy.emit(false);
    }
  } else {
    this.store.dispatch(new addPageContent([...this.formContentList]));
  }

 
  
  this.formInit();

}



onAddChoice(){
  (<FormArray>this.fromContent.get('options')).push(new FormGroup({
    'id': new FormControl(idGenerator() ),
    'arChoice': new FormControl(''  , [Validators.required] ),
    'enChoice': new FormControl('' , [Validators.required])
  }));

}

get controls() { 
  return (<FormArray>this.fromContent.get('options')).controls;
}

removeChoice(index:number){
  if((<FormArray>this.fromContent.get('options')).length > 1){
  (<FormArray>this.fromContent.get('options')).removeAt(index);
}

}


removeItem = index => {

  if(!this.editItem){
  this.formContentList.splice(index , 1);
  if(this.editContent){
    this.editPageService.content.emit([...this.formContentList]);
    if(this.formContentList.length > 0){
      this.editPageService.contentValidatiy.emit(true);
    }else {
      this.editPageService.contentValidatiy.emit(false);
    }
  }else{
    this.store.dispatch(new addPageContent([...this.formContentList]));
  }}
  else {
    alert('Deleting not available while editing item!!')
  }
}


renderTableType = item => {

  if (item.type === 'textInput'){
    return item.type + ' (' + item.keyboardType  +')' ;
  } else if (item.type === 'fileUpload'){
    return item.type + ' (' + item.fileType  +')' ;
  } 
    else if (item.type === 'checkbox' || item.type === 'radioButtons'){
    return item.type + ' (' + item.options.length  +')' ;
  } else {
    return item.type;
  }


}

onEditItem(index){

  this.editItem = this.formContentList[index];
  this.onChange(this.editItem.type)
  this.editindex = index
  this.fromContent.get('enLabel').setValue(this.editItem.enLabel);
  this.fromContent.get('arLabel').setValue(this.editItem.arLabel);

  if(this.editItem.type === 'textInput'){
    this.fromContent.get('keyboardType').setValue(this.editItem.keyboardType);
  } 

  if(this.editItem.type === 'fileUpload'){
    this.fromContent.get('fileType').setValue(this.editItem.fileType);
  }

  if (this.editItem.type === 'checkbox' || this.editItem.type === 'radioButtons' ){

    const options = new FormArray([]);

    this.editItem.options.forEach(item => {

      options.push(
        new FormGroup({
          'id' : new FormControl (item.id),
          'enChoice': new FormControl (item.enChoice  , [Validators.required]),
          'arChoice': new FormControl (item.arChoice , [Validators.required] )
        }));

   })

      this.fromContent.setControl('options', options);



  }


}


cancelEditItem(){

  this.editindex = null;
  this.editItem = null;
  this.fromContent.reset();

}

}
