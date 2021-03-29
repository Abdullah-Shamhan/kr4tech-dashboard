import { Effect, ofType , Actions } from "@ngrx/effects";
import { switchMap, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromApp from '../../app.reducer'
import * as slidersActions from './sliders.actions';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { PopupService } from 'src/app/services/popup.service';
import { environment } from 'src/environments/environment';


@Injectable()
export class slidersEffects {

constructor(private action$:Actions ,  private popup : PopupService , private http: HttpClient , 
   private router:Router  , private route:ActivatedRoute , private store:Store<fromApp.appState> ,
   private upload: UploadFileService){}


@Effect()
fetchSliders = this.action$.pipe(ofType(slidersActions.FETCH_SLIDERS) , switchMap(() => {

    return this.http.get<{}>(`${environment.firebase.databaseURL}/Available/Sliders.json`)
}) , map(sliders => {  

         let slidersList = [];
         if (sliders !== null){
         slidersList = Object.keys(sliders).map(key => sliders[key]);
        }
      
        return new slidersActions.loadSliders(slidersList);
}));


@Effect()
storeSlider = this.action$.pipe(ofType(slidersActions.POST_SLIDER) , switchMap((action: slidersActions.postSlider ) => {

   return this.http.put<any>(`${environment.firebase.databaseURL}/Available/Sliders/${action.payload.id}.json` , action.payload).pipe(map(res => {

         this.popup.showMessage('Slider added/update successfully!!');
        return new slidersActions.saveSlider(action.payload);

      }));
   
   
}));



@Effect({dispatch: false})
deleteSliders = this.action$.pipe(ofType(slidersActions.DELETE_SLIDER) , switchMap((actionData: slidersActions.deleteSlider ) => {

   const path = 'sliders/' + actionData.payload.id ;
   
   if (actionData.payload.withImages){
      this.upload.deleteFile(path );
   }
   

    return this.http.delete(`${environment.firebase.databaseURL}/Available/Sliders/${actionData.payload.id}.json`)
}) , map(res => {  
  
        this.popup.showMessage('Slider deleted successfully!!')
        this.store.dispatch(new slidersActions.clearLoading());
}));





}