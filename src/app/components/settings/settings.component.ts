import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Subscription } from 'rxjs';
import { Icon } from 'ionicons/dist/types/components/icon/icon';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit , OnDestroy {

  constructor(private configService : SettingsService) { }

  loading : Subscription;
  service : Subscription;
  image: File = null;
  fileName: String = 'Choose image';
  primary: string = '#0dace6';
  secondary: string = '#ebf8fc';
  tertiary: string = '';
  instaLink: string = '';
  whatslink: string = '';
  server: string = '';

  currentIcon: string = null;
  isLoading = false;

  ngOnInit(): void {

    
    this.loading = this.configService.isLoding.subscribe(val => this.isLoading = val);

    this.service = this.configService.fetchConfig().subscribe((val : {primary : string , secondary : string , tertiary : string , icon : string ,  whatsapp : string , instagram: string , server: string}) => {

      if(val){
        this.primary = val.primary;
        this.secondary = val.secondary;
        this.tertiary = val.tertiary;
        this.currentIcon = val.icon;
        this.whatslink = val.whatsapp;
        this.instaLink = val.instagram;
        this.server = val.server;
      }


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


onSave(){

this.configService.updateSettings(this.primary , this.secondary , this.tertiary , this.whatslink , this.server , this.instaLink , this.currentIcon , this.image)

}





ngOnDestroy (){

  if(this.loading)
  this.loading.unsubscribe();

  if(this.service)
  this.service.unsubscribe();

}



}
