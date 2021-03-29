import { Injectable, EventEmitter } from '@angular/core';
import { UploadFileService } from './upload-file.service';
import { HttpClient } from '@angular/common/http';
import { PopupService } from './popup.service';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private upload  : UploadFileService , private http : HttpClient , private popup : PopupService) { }


  isLoding = new EventEmitter<boolean>(true);



  updateSettings (primary , secondary , tertiary , whatsapp , server , instagram , currentImage , image: File = null ){

    this.isLoding.emit(true);

     try {
    if(image){

     
      const path = 'icon/' + new Date().getTime() + '_' + image.name;
      this.upload.uploadSingleImage(image , path ).then(url => {

        const config = {primary : primary , secondary : secondary , tertiary : tertiary , icon : url , whatsapp : whatsapp , instagram: instagram , server : server};
        this.http.put(`${environment.firebase.databaseURL}/App/config.json` ,  {...config}).subscribe(res => {


          this.isLoding.emit(false);
          this.popup.showMessage('Settings updated successfully!!');


        });

      });

    } else {

      const config = {primary : primary , secondary : secondary , tertiary : tertiary , icon : currentImage ,  whatsapp : whatsapp , instagram: instagram , server : server};
      this.http.put(`${environment.firebase.databaseURL}/App/config.json` ,  {...config}).subscribe(res => {

        this.isLoding.emit(false);
        this.popup.showMessage('Settings updated successfully!!');


      });



    }
  } catch (err) {

    this.isLoding.emit(false);
    this.popup.showMessage('Something went wrong!!');

  }






  }


  fetchConfig = () => {

    this.isLoding.emit(true);

    return this.http.get(`${environment.firebase.databaseURL}/App/config.json`).pipe(tap(() => {

    this.isLoding.emit(false);

    }));

  }

}
