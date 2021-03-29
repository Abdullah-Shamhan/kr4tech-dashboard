import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient  , HttpParams  } from '@angular/common/http';
import { PopupService } from './popup.service';
import { UploadFileService } from './upload-file.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import { addPopup } from '../store/appContent/appContent.actions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(private http: HttpClient  , private popup: PopupService  , private upload : UploadFileService , private store: Store<fromApp.appState> ) { }
  
  isLoading = new EventEmitter<boolean>(false);


  pushNotification(title , body , language){

    this.isLoading.next(true);

    this.http.get(`${environment.firebase.databaseURL}/App/Notifications/Tokens-${language}.json`).subscribe(res => {

      if(res){
      let tokensList = [];
      tokensList =  Object.keys(res).map(key => res[key]);

    if(tokensList){
      const size = 100; 
      if(tokensList.length > size) {

        const arraysOfTokens = [];

        for (let i = 0; i  < tokensList.length; i+=size ) {

         arraysOfTokens.push(tokensList.slice(i,i+size));

        }         


        arraysOfTokens.forEach((arr , index) => {

          const tokens = JSON.stringify(arr);
          this.http.get( `https://kr-app-2020.herokuapp.com/send/?title=${title}&body=${body}&tokens=${tokens}` ).subscribe(res => {
    
          

          if (index === (arraysOfTokens.length - 1)){

            
            if (res === 'notification sent'){

              const notification = {title : title , body : body};
              this.storeNotifications(notification , language);
              this.popup.showMessage('Notification sent succeffully!!');
            } else {
              this.popup.showMessage('An error occured');
            }
            
           
            this.isLoading.next(false);
          }
    
         });



        });
        

      } else {

       // 
       //https://kr-server-51752.firebaseapp.com
        const tokens = JSON.stringify(tokensList);
        this.http.get( `https://kr-app-2020.herokuapp.com/send/?title=${title}&body=${body}&tokens=${tokens}` ).subscribe(res => {
  
          const notification = {title : title , body : body};
        

          if (res === 'notification sent'){


            this.storeNotifications(notification , language);
            this.popup.showMessage('Notification sent succeffully!!');
            this.isLoading.next(false);
          } else {
            this.popup.showMessage('An error occured');
            this.isLoading.next(false);
          }

      });

      }
    } else {

      this.popup.showMessage('No tokens available!!');
      this.isLoading.next(false);

    }
      
      



    } else {
      this.popup.showMessage('No tokens available!!');
      this.isLoading.next(false);
    }
  }
    
    );

  
}


storeNotifications(notification , language){


  this.http.get(`${environment.firebase.databaseURL}/App/Notifications/Notifications-history-${language}.json` ).subscribe((res : []) => {


    let updatedList = [];
      if( res ){

        if(res.length >= 20){
          updatedList = [...res];
          updatedList[0] = notification;
        } else {

          updatedList = [notification , ...res];
       
  
        }
        
      } else {

       
        updatedList.push(notification);

      }

      this.http.put(`${environment.firebase.databaseURL}/App/Notifications/Notifications-history-${language}.json` , updatedList).subscribe(res => {
      
      });

  });


  

}


  appPopup (image: File , id  , currentId) {

    this.isLoading.next(true);

    if(currentId !== null){
      this.upload.deleteFile('popup/');
    }

    const path  = 'popup/' + id + '_' + image.name ;
    this.upload.uploadSingleImage(image , path).then(url => {

      this.http.put(`${environment.firebase.databaseURL}/App/Notifications/popup-ads.json` , {id : id , imageUrl : url}).subscribe(res => {

      this.store.dispatch(new addPopup(url));
        this.isLoading.next(false);
        this.popup.showMessage('Popup image added successfully!!');
      });

    }).catch(err => {

      alert('Something went wrong!!');
      this.isLoading.next(false);

    });


  }


  removePopUp (id){
    this.isLoading.next(true);

    const path  = 'popup/' + id ;

    this.upload.deleteSingleImage(path);

    this.http.delete(`${environment.firebase.databaseURL}/App/Notifications/popup-ads.json`).subscribe(res => {

      this.store.dispatch(new addPopup({id : null , imageUrl : null}));
      this.isLoading.next(false);
      this.popup.showMessage('Popup removed successfully!!');
      });


  }


}
