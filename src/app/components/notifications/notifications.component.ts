import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import idGenerator from 'src/app/shared/idGenerator/idGenerator';
import { Store } from '@ngrx/store';
import * as fromApp from '../../app.reducer';
import * as appContentActions from '../../store/appContent/appContent.actions';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notificationForm : FormGroup;
  isLoading = false;
  mode = 'English';
  image: File = null;
  fileName: String = 'Choose image';
  currentPopup = '';
  popUpid = null;

  constructor(private notificationService: PushNotificationService , private store: Store<fromApp.appState>) { }

  ngOnInit(): void {

    this.store.dispatch(new appContentActions.getCurrentPopup());

    this.formInit();

    this.notificationService.isLoading.subscribe(val => {
      
      this.isLoading = val;
    });

    this.store.select('appContent').subscribe(state => {

      this.currentPopup = state.popupImage.imageUrl === '' ? null :  state.popupImage.imageUrl ;
      this.popUpid = state.popupImage.id === '' ? null : state.popupImage.id;

    });

  }


  
  formInit () {

    this.notificationForm = new FormGroup({
      title : new FormControl('' , [Validators.required]),
      description : new FormControl('' , [Validators.required])
    });


  }

  onNotification(){

    
    const lang  = this.mode === 'English' ? 'EN' : 'AR';

    const title = this.notificationForm.get('title').value;
    const description = this.notificationForm.get('description').value;
    this.notificationService.pushNotification(title , description , lang);


  }

  onPopup(){

    if (this.image !== undefined || this.image !== null){

      const currentId = this.popUpid === null || this.popUpid === '' ? null :  this.popUpid ;
      this.notificationService.appPopup(this.image , idGenerator() , currentId);

    }

  }

  removePopup(){

    if(this.popUpid){
      this.notificationService.removePopUp(this.popUpid);
    }

  }

  modeChanged = (val) => {

    this.mode = val;


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

}
