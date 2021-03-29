import { Effect, ofType } from "@ngrx/effects";
import { Actions } from "@ngrx/effects";
import { switchMap, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import * as articlesActions from './articles.actions';
import { PopupService } from 'src/app/services/popup.service';
import { FullPage } from 'src/app/models/fullPage';
import { Slider } from 'src/app/models/slider';
import { environment } from 'src/environments/environment';


@Injectable()
export class articlesEffects {

constructor(private action$:Actions , private http: HttpClient , 
   private router:Router  , private route:ActivatedRoute , private popup : PopupService ){}


@Effect()
fetchArticles = this.action$.pipe(ofType(articlesActions.FETCH_ARTICLES) , switchMap(() => {

    return this.http.get<{}>(`${environment.firebase.databaseURL}/Available/Articles.json`)
}) , map(articles => {  
      
      let articlesList = [];
      if(articles){
            articlesList = Object.keys(articles).map(key => articles[key]);
      }
        

        return new articlesActions.setArticles(articlesList);
}));


@Effect()
storeArticle = this.action$.pipe(ofType(articlesActions.STORE_ARTICLE) , switchMap((action: articlesActions.storeArticle ) => {

   return this.http.put<any>(`${environment.firebase.databaseURL}/Available/Articles/${action.payload.id}.json` , action.payload).pipe(map(res => {

         this.popup.showMessage('Article added/updated successfully!!');
        return new articlesActions.addArticle(action.payload);

      }));
   
   
}));

@Effect()
deleteArticle = this.action$.pipe(ofType(articlesActions.DELETE_ARTICLE) , switchMap((action: articlesActions.deleteArticle ) => {

   return this.http.delete(`${environment.firebase.databaseURL}/Available/Articles/${action.payload}.json` ).pipe(map(res => {

         this.popup.showMessage('Article deleted successfully!!');
        return new articlesActions.clearLoading();

      }));
   
   
}));


@Effect()
updateArticle = this.action$.pipe(ofType(articlesActions.UPDATE_ARTICLE) , switchMap((action: articlesActions.updateArticle ) => {

   return this.http.put<any>(`${environment.firebase.databaseURL}/Available/Articles/${action.payload.id}.json` , action.payload).pipe(map(res => {

      
            return action.payload;
      }) , switchMap(article => {

            return this.http.get<{Pages : {} , Sliders: {}}>(`${environment.firebase.databaseURL}/Available.json`).pipe(map(available => {

            const pages = available.Pages ;
            const sliders = available.Sliders;
            let pagesList : FullPage[];
            let slidersList : Slider[];
            let updatedPages  = [];
            let updatedSliders  = []; 
            
            if (pages != null){
                pagesList = Object.keys(pages).map(key => pages[key]);
            

           pagesList.forEach((page , index) => {

            if(page.pageType === 'article' || page.pageType === 'blog'){

                  page.content.forEach((item , i) => {

                        if (item.id === article.id){

                              pagesList[index].content[i] = article;
                              
                              updatedPages = [ ...updatedPages ,  pagesList[index]];

                        }

                  });


            }


      }); 

            }   

            if (sliders != null){
            slidersList = Object.keys(sliders).map(key => sliders[key]);
            

            slidersList.forEach((slider , index) => {

                  slider.content.forEach((item , i) => {

                        if(item.navTo.pageType === 'article' || item.navTo.pageType === 'blog'){

                              item.navTo.content.forEach((e , ix) => {

                                    if (e.id === article.id){

                                          slidersList[index].content[i].navTo.content[ix] = article;
                                          
                                          updatedSliders = [ ...updatedSliders ,  slidersList[index]];
            
                                    }


                              });


                        }


                  })

            }); 

            }


            let finalPages = {}
            updatedPages.forEach(item => {


                  finalPages = {...finalPages , [item.id] : item} ;
            });

            let finalSliders = {};
            updatedSliders.forEach(item => {


                  finalSliders = {...finalSliders , [item.id] : item} ;
            });


            const updateData = {
                  Pages : finalPages,
                  Sliders : finalSliders
            }

            return updateData;

            }) , switchMap(updateData => {

                 return this.http.patch(`${environment.firebase.databaseURL}/Available/Pages.json` , {...updateData.Pages} ).pipe(switchMap(res => {

                    return this.http.patch(`${environment.firebase.databaseURL}/Available/Sliders.json` , {...updateData.Sliders} ).pipe(map(res => {

                  this.popup.showMessage('Article updated successfully!!');
                  return new articlesActions.addArticle(action.payload);


                    }));


                 }));


            }));


      }));
   
   
}));



}