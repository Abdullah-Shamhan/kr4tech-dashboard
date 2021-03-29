import { Effect, ofType } from "@ngrx/effects";
import { Actions } from "@ngrx/effects";
import { switchMap, map, take  } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as appContnent from './appContent.actions';
import { PopupService } from 'src/app/services/popup.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../app.reducer';
import { environment } from 'src/environments/environment';

@Injectable()
export class appContentEffects {

constructor(private action$:Actions ,  private popup : PopupService , private http: HttpClient, private store: Store<fromApp.appState>){}


@Effect()
fetchAppContent = this.action$.pipe(ofType(appContnent.FETCH_CONTENT) , switchMap(() => {

    return this.http.get<any[]>(`${environment.firebase.databaseURL}/App/Content.json`)
}) , map(content => {  

        return new appContnent.loadContent(content);
}));

@Effect()
getCurrentPopup = this.action$.pipe(ofType(appContnent.GET_CURRENT_POPUP) , switchMap(() => {

    return this.http.get<{id: string , imageUrl: string}>(`${environment.firebase.databaseURL}/App/Notifications/popup-ads.json`)
}) , map(content => {  

            let currentPopup = {id: null , imageUrl: null} ;
        if(content){
            currentPopup = {id: content.id , imageUrl: content.imageUrl};
        }

        return new appContnent.addPopup(currentPopup);
}));



@Effect()
saveContentinDb = this.action$.pipe(ofType(appContnent.SAVE_CONTENT_IN_DB) , switchMap((actionData: appContnent.saveContentInnDb ) => {

    

    return this.http.put<any>(`${environment.firebase.databaseURL}/App/Content.json` , actionData.payload).pipe(map(res => {

        this.popup.showMessage('Content updated successfully!!');
       
        return new appContnent.clearLoading();

     }));
   
}));


@Effect()
updateAll = this.action$.pipe(ofType(appContnent.UPDATE_ALL) , map(() => {

    let pagesList = [];
    let slidersList = [];
    let contentList = [];
    this.store.select('page').pipe(take(1)).subscribe(pages => { pagesList = [...pages.availablePages]  });
    this.store.select('sliders').pipe(take(1)).subscribe(sliders => { slidersList = [...sliders.availableSliders] });
    this.store.select('appContent').pipe(take(1)).subscribe(app => { contentList = [...app.currentContent]  });
    

    let updatedContent = [];

    contentList.forEach(item => {

        if (item.pageType){

            if(item.pageType !== 'whatsapp' || item.pageType !== 'instagram'){

              const updatedPage =  pagesList.find(page => page.id === item.id);

              if(updatedPage !== undefined){

                updatedContent.push(updatedPage);
              } else {
                updatedContent.push(item);
              }



            } else {

                updatedContent.push(item);

            }



        } else {

            const updatedSlider = slidersList.find(slider => slider.id === item.id );

            if(updatedSlider !== undefined){

                updatedContent.push(updatedSlider);
              } else {
                updatedContent.push(item);
              }



        }


    });
   
    return new appContnent.loadContent(updatedContent);

}));



}