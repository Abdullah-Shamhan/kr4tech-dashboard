import { Effect, ofType } from "@ngrx/effects";
import { Actions } from "@ngrx/effects";
import { switchMap, map, tap  } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromApp from '../../app.reducer'
import * as pageActions from './page.actions';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { FullPage } from 'src/app/models/fullPage';
import { PopupService } from 'src/app/services/popup.service';
import { fetchSliders } from '../sliders/sliders.actions';
import { environment } from 'src/environments/environment';


@Injectable()
export class pageEffects {

constructor(private action$:Actions ,  private popup : PopupService , private http: HttpClient , 
   private router:Router  , private route:ActivatedRoute , private store:Store<fromApp.appState> ,
   private upload: UploadFileService){}


@Effect()
fetchPages = this.action$.pipe(ofType(pageActions.FETCH_PAGES) , switchMap(() => {

    return this.http.get<{}>(`${environment.firebase.databaseURL}/Available/Pages.json`)
}) , map(pages => {  

      let pagesList = [];
         if (pages != null){
       pagesList = Object.keys(pages).map(key => pages[key]);
      }

        return new pageActions.loadPages(pagesList);
}));


@Effect()
postPage = this.action$.pipe(ofType(pageActions.POST_PAGE) , switchMap((actionData: pageActions.postPage ) => {

   const image  =  actionData.payload.page.importFile;
   const path =  'images/' + actionData.payload.page.id + '/' + new Date().getTime() + '_' +  image.name  ;
   
   return this.upload.uploadImage(image ,path).pipe(switchMap(url => {

      const page = actionData.payload.page;
      let fullPage ; 

      if (page.isFree === 'free') {

         fullPage = new FullPage(page.id ,page.enTitle ,page.arTitle ,page.enDescription , page.arDescription, 
            page.buttonType , page.buttonSize , page.buttonColor , url ,page.isFree , page.pageType , 
            actionData.payload.content , new Date().toLocaleDateString()); 
      } else {

         fullPage = new FullPage(page.id ,page.enTitle ,page.arTitle ,page.enDescription , page.arDescription, 
            page.buttonType , page.buttonSize , page.buttonColor , url ,page.isFree , page.pageType , 
            actionData.payload.content , new Date().toLocaleDateString() , page.productCodeIOS , page.productCodeANDROID); 
      }

      return this.http.put<any>(`${environment.firebase.databaseURL}/Available/Pages/${page.id}.json` ,  {...fullPage}).pipe(map(res => {

      this.popup.showMessage('Page added successfully!!');
        return new pageActions.savePage(fullPage);

      }));

   }));
   
}));


@Effect({dispatch: false})
redirect = this.action$.pipe(ofType(pageActions.SAVE_PAGE) , tap(() => {

   this.router.navigate(['pages/add-page'] , {relativeTo: this.route});

}))



@Effect({dispatch: false})
deletePage = this.action$.pipe(ofType(pageActions.DELETE_PAGE) , switchMap((actionData: pageActions.deletePage ) => {

   const path = 'images/' + actionData.payload.id ;
   
   if(actionData.payload.withImages){
      this.upload.deleteFile(path );
   }
   
    return this.http.delete(`${environment.firebase.databaseURL}/Available/Pages/${actionData.payload.id}.json`)
}) , map(pages => {  
  
        this.popup.showMessage('Page deleted successfully!!')
        this.store.dispatch(new pageActions.clearLoading());
}));


@Effect()
generatePage = this.action$.pipe(ofType(pageActions.GENERATE_PAGE) , switchMap((actionData: pageActions.generatePage ) => {

    return this.http.put(`${environment.firebase.databaseURL}/Available/Pages/${actionData.payload.id}.json` , actionData.payload).pipe(map(res => {

      this.popup.showMessage('Page generated successfully!!')
      return new pageActions.saveGeneratedPage(actionData.payload);

    }));


}));


@Effect()
updateWithImage = this.action$.pipe(ofType(pageActions.UPDATE_PAGE_WITH_IMAGE) , switchMap((actionData: pageActions.updatePageWithImage ) => {

   const image  =  actionData.payload.image;
   const path =  'images/' + actionData.payload.page.id + '/' + new Date().getTime()  + '_' +  image.name ;

   return this.upload.uploadImage(image ,path).pipe(switchMap(url => {

      const page = actionData.payload.page;
     const fullPage =  new FullPage(page.id ,page.enTitle ,page.arTitle ,page.enDescription , page.arDescription, 
            page.buttonType , page.buttonSize , page.buttonColor , url ,page.isFree , page.pageType , 
            actionData.payload.page.content , new Date().toLocaleDateString() , page.productCodeIOS , page.productCodeANDROID); 
      

      return this.http.put<any>(`${environment.firebase.databaseURL}/Available/Pages/${page.id}.json` ,  {...fullPage}).pipe(map(res => {

      
        return new pageActions.afterUpdate(fullPage);

      }));

   }));
   
}));


@Effect()
updatePage = this.action$.pipe(ofType(pageActions.UPDATE_PAGE) , switchMap((actionData: pageActions.updatePage ) => {

    return this.http.put(`${environment.firebase.databaseURL}/Available/Pages/${actionData.payload.id}.json` , actionData.payload).pipe(map(res => {

      return new pageActions.afterUpdate(actionData.payload);

    }));


}));



@Effect()
afterUpdate = this.action$.pipe(ofType(pageActions.AFTER_UPDATE) , switchMap((actionData: pageActions.afterUpdate ) => {

   return this.http.get(`${environment.firebase.databaseURL}/Available/Sliders.json`).pipe(map(sliders => {

      let slidersList = [];
      let updatedSliders = [];

      if (sliders != null){
         slidersList = Object.keys(sliders).map(key => sliders[key]);
         

         slidersList.forEach((slider , index) => {

               slider.content.forEach((item , i) => {

                  if(item.navTo.id === actionData.payload.id){

                     slidersList[index].content[i].navTo = actionData.payload;
                     updatedSliders = [...updatedSliders , slidersList[index] ];


                  }
                  

         }); 

         
      }); 

   }

   
   let finalSliders = {};
   updatedSliders.forEach(item => {


         finalSliders = {...finalSliders , [item.id] : item} ;
   });

   

   return finalSliders;


      }) , switchMap(finalSliders => {


         return this.http.patch(`${environment.firebase.databaseURL}/Available/Sliders.json`  , finalSliders ).pipe(map(res => {

            this.popup.showMessage('Page update successfully!!');
            return new pageActions.saveUpdate(actionData.payload);


         }));



      }));


}));



@Effect({dispatch: false})
refreshSliders = this.action$.pipe(ofType(pageActions.SAVE_UPDATE) , map((actionData: pageActions.saveUpdate ) => {

      this.store.dispatch(new fetchSliders());

}));



}