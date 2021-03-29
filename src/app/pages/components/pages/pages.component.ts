import { Component, OnInit, OnDestroy } from '@angular/core';
import { FullPage } from 'src/app/models/fullPage';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/app.reducer';
import { Subscription  , combineLatest} from 'rxjs';
import { deletePage } from 'src/app/store/pages/page.actions';
import { addContent } from 'src/app/store/appContent/appContent.actions';
import { PopupService } from 'src/app/services/popup.service';
import * as sortLsit from 'src/app/shared/listSorting';
import { EditPageService } from 'src/app/services/edit-page.service';
import * as pageActions from 'src/app/store/pages/page.actions';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit , OnDestroy {

  pages: FullPage[];
  forFiltering: FullPage[];
  storeSub : Subscription;
  isLoading  = false;
  appContentList = [];
  currentSortBy = 'date'
    //for editing mode
    pgValiditySub : Subscription;
    contentValiditySub : Subscription;
    pageServiceSub : Subscription;
    contentServiceSub : Subscription;
    imageServiceSub : Subscription;
    updatedImage : File;
    isEditing = false;
    editPage : FullPage;
    servicePage : FullPage;
    serviceContent = [];
    pageIsValid = true;
    contentIsValid = true;
    //-------------------------


  constructor(private store: Store<fromApp.appState>  , private popup: PopupService  , private editPageService: EditPageService) { }

  ngOnInit() {

    this.storeSub = combineLatest([this.store.select('page') , this.store.select('appContent')]).subscribe(([page , appContent ]) => {

      this.pages = [...page.availablePages].sort(sortLsit.sortByDate);
      this.forFiltering = [...page.availablePages].sort(sortLsit.sortByDate);

      this.isLoading = page.isLoading
      this.appContentList = appContent.currentContent;

    });

    this.pgValiditySub =  this.editPageService.pageValidity.subscribe(val => this.pageIsValid = val);
    this.contentValiditySub =  this.editPageService.contentValidatiy.subscribe(val => this.contentIsValid = val);
    this.pageServiceSub =  this.editPageService.page.subscribe(val => this.servicePage = val);
    this.contentServiceSub =  this.editPageService.content.subscribe(val => this.serviceContent = val);
    this.contentServiceSub =  this.editPageService.imageChanged.subscribe(val => this.updatedImage = val);
  }


  onSort(value) {

    this.currentSortBy = value;
    switch(value){
      
      case 'title':
       this.pages.sort(sortLsit.sortByTitle);
       break;
      case 'page':
        this.pages.sort(sortLsit.sortByPageType);
        break;
      case 'date':
        this.pages.sort(sortLsit.sortByDate);
        break;
      case 'cost':
        this.pages.sort(sortLsit.sortByCost);
        break;
      default:
        this.pages.sort(sortLsit.sortByDate);

    }
  }

  onFilter(value){

    this.pages = sortLsit.filter(this.forFiltering , value);
    
    switch(this.currentSortBy){
      
      case 'title':
       this.pages.sort(sortLsit.sortByTitle);
       break;
      case 'page':
        this.pages.sort(sortLsit.sortByPageType);
        break;
      case 'date':
        this.pages.sort(sortLsit.sortByDate);
        break;
      case 'cost':
        this.pages.sort(sortLsit.sortByCost);
        break;
      default:
        this.pages.sort(sortLsit.sortByDate);

    }
    
  }

  onDelete = (id ) => {

    let index = -1;
    if (this.appContentList){
      index = this.appContentList.findIndex(item => item.id === id);
    }
   
    if(index === -1){
      this.store.dispatch(new deletePage({id : id , withImages : true}));
    } else {
      this.store.dispatch(new deletePage({id : id , withImages : false}));
    }

    
  }

  ngOnDestroy(){

    if(this.storeSub){
     this.storeSub.unsubscribe();
   }

   if (this.pgValiditySub)
    this.pgValiditySub.unsubscribe();

    if (this.contentValiditySub)
    this.contentValiditySub.unsubscribe();

    if (this.pageServiceSub)
    this.pageServiceSub.unsubscribe();

    if (this.contentServiceSub)
    this.contentServiceSub.unsubscribe();




  }

  onAddtoApp = item => {
    
      this.store.dispatch(new addContent(item));
      this.popup.showMessage(item.enTitle + ' added/updated successfully!!');

  }

  onEdit(page){

    this.isEditing = true;
    this.editPage = page;
  }

  onCancel(){

    this.isEditing = false;
    this.serviceContent = [];
    this.editPageService.cancel();
    this.editPage = null;

  }

  onSave(){

    const updatedPage = new FullPage(
      this.servicePage.id,
      this.servicePage.enTitle,
      this.servicePage.arTitle,
      this.servicePage.enDescription,
      this.servicePage.arDescription,
      this.servicePage.buttonType,
      this.servicePage.buttonSize,
      this.servicePage.buttonColor,
      this.editPage.imageUrl,
      this.servicePage.isFree,
      this.editPage.pageType,
      this.serviceContent,
      new Date().toLocaleDateString(),
      this.servicePage.productCodeIOS,
      this.servicePage.productCodeANDROID
    )

    if(this.updatedImage){
      this.store.dispatch(new pageActions.updatePageWithImage({page: updatedPage , image : this.updatedImage}));
    } else {
      this.store.dispatch(new pageActions.updatePage(updatedPage));
    }
    

    this.updatedImage  = null;
    this.isEditing = false;
    this.editPage  = null;
    this.editPageService.cancel();
    
  }

  
}
