import { Component, OnInit, HostListener, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/app.reducer';
import { addPageContent, invalidPage } from 'src/app/store/addPage/newPage.actions';
import { Subscription } from 'rxjs';
import { EditPageService } from 'src/app/services/edit-page.service';
import { sortByDate } from 'src/app/shared/listSorting';

@Component({
  selector: 'app-add-article-content',
  templateUrl: './add-article-content.component.html',
  styleUrls: ['./add-article-content.component.css']
})
export class AddArticleContentComponent implements OnInit , OnDestroy {
  @Input('content') articleId : string;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if(!this.articleId)
    this.store.dispatch(new invalidPage());
  }

  
  
  articlesList  = [];
  storeSub: Subscription;
  currentSelectedId = '';

  constructor(private store: Store<fromApp.appState> , private editPageService: EditPageService) { }

  ngOnInit(): void {

    if(this.articleId){
      this.currentSelectedId = this.articleId;
    }

    this.storeSub = this.store.select('articles').subscribe(state => {

      this.articlesList = [...state.availableArticles].sort(sortByDate);
      
    });

    if(this.articleId){

     const index = this.articlesList.findIndex(item => item.id === this.articleId);

     if(index === -1 ){
        this.editPageService.contentValidatiy.emit(false);
      } else {
        this.editPageService.content.emit([this.articlesList[index]]);
      }

    }

    
  }


  onRowClick = index => {
    
    this.currentSelectedId = this.articlesList[index].id;

    const selectedArticle = this.articlesList[index];

    if (selectedArticle !== null || selectedArticle !== undefined){

      if(!this.articleId){
        this.store.dispatch(new addPageContent([selectedArticle]));
      } else {
          this.editPageService.content.emit([selectedArticle]);
          this.editPageService.contentValidatiy.emit(true);
      } 
      
    }

  }

  onView = htmlContent => {

    const HtmlContainer = `
    <script src="https://firebasestorage.googleapis.com/v0/b/kr-app-49b1f.appspot.com/o/webview%20styles%2Fhighlight.js?alt=media&token=1e5b2215-d4d1-441f-abb4-b53a1885f3ef"></script>
    <link rel="stylesheet" type="text/css" href="https://firebasestorage.googleapis.com/v0/b/kr-app-49b1f.appspot.com/o/webview%20styles%2Farticle%20editor.css?alt=media&token=908b8c8b-4928-47db-8c36-ff4da1edbd6e">
    <link rel="stylesheet" type="text/css" href="https://firebasestorage.googleapis.com/v0/b/kr-app-49b1f.appspot.com/o/webview%20styles%2Fquill.snow.css?alt=media&token=a66aede4-82b2-4bc0-9df2-fe62fe28b022">
    <div class="ql-container ql-snow " >
    <div class="ql-editor " >
    ${htmlContent}
  </div>
  </div>
    `;

    const wnd = window.open("about:blank",  "_blank", `toolbar=no,
    location=no,
    status=no,
    menubar=no,
    scrollbars=yes,
    resizable=yes,
    width=350px,
    height=600px`);
    
    wnd.document.write(HtmlContainer);
    return false;
  }




  ngOnDestroy(){
    
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }
} 

