import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import {  finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor( private storage: AngularFireStorage) { }



  uploadMultipleImages (images : File[] , pageId , itemId){

    const urlsList = [];

  
    
    return  new Promise<any>((res , rej) => {

      for (let image of images){

        const path = 'images/' + pageId + '/' + new Date().getTime() + '_' + image.name ;
        this.uploadSingleImage(image , path).then(url => {
  
          urlsList.push(url);
          if(images.length === urlsList.length){
              res(urlsList);
          }
  
        }).catch(err => {
          
          alert('Error occured: ' + err);
        });
  
      }


    });

  }

  //uploadSingleImage() {
    uploadSingleImage(image: File , path: string) {

    const fileRef = this.storage.ref(path);
    let downloadLink;
    const task = this.storage.upload(path , image);
    
    return new Promise<any>((resolve , reject) => {

      task.snapshotChanges().pipe( finalize(() => {

        downloadLink = fileRef.getDownloadURL();
  
        downloadLink.subscribe( res => {
  
            if(res){
              
              resolve(res);
            } else {
              reject('Error uploading the image');
            }
           
        });
  
      })).subscribe();



    });
    


  }

  uploadImage(image: File , path: string) {

    const fileRef = this.storage.ref(path);
    let downloadLink;
    const task = this.storage.upload(path , image);

    return new Observable<any>(observer => {

      task.snapshotChanges().pipe( finalize(() => {

        downloadLink = fileRef.getDownloadURL();
  
        downloadLink.subscribe( res => {
  
            if(res){
              
              observer.next(res);
            } else {
              observer.error('an error occured');
            }
           
        });
  
      })).subscribe();



    })

  }



  deleteFile(path ){

    this.storage.ref(path).listAll().subscribe(data => {

      data.items.forEach(item => {  
        this.storage.storage.ref(item['location']['path']).delete()
      });
  
    });


  }


  deleteSingleImage(path ){

    this.storage.ref(path).delete().subscribe(data => {

      console.log(data);
      
    });


  }

}
