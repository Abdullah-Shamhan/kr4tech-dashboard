import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/app.reducer';
import { Subscription  , combineLatest} from 'rxjs';
import { Page } from 'src/app/models/page';
import {  filter } from 'rxjs/operators';
import { postPage } from 'src/app/store/pages/page.actions';
import { invalidPage } from 'src/app/store/addPage/newPage.actions';


@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.css']
})
export class AddPageComponent implements OnInit , OnDestroy{


  header : string = '';
  buttonIsEnabled = true;
  buttonTitle : string = 'NEXT';
  pageSub: Subscription;
  addPageSub: Subscription;
  routerSub: Subscription;
  page: Page = null;
  content = [];
  mode  = 'page';
  isUploading = false;
  isLoading = false;

  constructor(private router: Router , private store: Store<fromApp.appState> , private activatedRoute: ActivatedRoute ) {


   }

  ngOnInit() {

    
    this.pageSub =this.store.select('page').subscribe(page => {
      this.isLoading = page.isLoading;
    })

    this.addPageSub =this.store.select('addPage').subscribe(addPage => {
      this.isUploading = addPage.isUploading;

      if (this.mode === 'page'){
      this.buttonIsEnabled = !addPage.pageIsValid;
      this.page = addPage.page;
    } else if (this.mode === 'content'){
      this.content = addPage.content
      if(this.content !== null)
      {
      this.buttonIsEnabled = this.content.length > 0 ? false : true;
    }
    }
    })
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)  
    ).subscribe((event: NavigationEnd) => {

      if ((this.mode === 'content' && event.url === '/pages/add-page')) {
        
        this.header = '';
        this.buttonIsEnabled = true;
        this.buttonTitle  = 'NEXT';      
        this.page = null;
        this.content = [];
        this.mode  = 'page';
        this.store.dispatch(new invalidPage());
      } 

      
    });

  
   
  }

  onPress = () => {

    if(this.page && this.content.length === 0) {

      const pageType = this.page.pageType;
      this.buttonTitle = 'ADD ' + pageType.toUpperCase();
      this.header = ' - ' + pageType.toUpperCase();
      this.mode = 'content';

      switch(pageType){
      case "form":
        this.router.navigate(['form-data'] ,{relativeTo: this.activatedRoute});
        break;
      case "gallery":
        this.router.navigate(['gallery-data' , this.page.id] ,{relativeTo: this.activatedRoute});
        break;
      case "catalogue":
        this.router.navigate(['catalogue-data' , this.page.id] ,{relativeTo: this.activatedRoute});
        break;
      case "blog":
        this.router.navigate(['blog-data'] ,{relativeTo: this.activatedRoute});
        break;
      case "article":
        this.router.navigate(['atricle-data'] ,{relativeTo: this.activatedRoute});
        break;
      case "link":
        this.router.navigate(['link-data'] ,{relativeTo: this.activatedRoute});
        break;
      default:
        return;

    }

    
     this.buttonIsEnabled  = true;

} else if(this.page && this.content.length > 0) {

  this.header = '';
  this.store.dispatch(new postPage({page :this.page , content: this.content}));
  
}
 

  }

  ngOnDestroy() {

    if (this.pageSub){
      this.pageSub.unsubscribe();
    }

    if (this.addPageSub){
      this.addPageSub.unsubscribe();
    }

    if (this.routerSub){
      this.routerSub.unsubscribe();
    }


  }



}

   