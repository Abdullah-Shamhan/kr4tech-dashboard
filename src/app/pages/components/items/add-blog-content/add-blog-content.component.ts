import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/app.reducer';
import { addPageContent , invalidPage } from 'src/app/store/addPage/newPage.actions';
import { Subscription } from 'rxjs/internal/Subscription';
import { EditPageService } from 'src/app/services/edit-page.service';
import { sortByDate } from 'src/app/shared/listSorting';
import { Article } from 'src/app/models/article';

@Component({
  selector: 'app-add-blog-content',
  templateUrl: './add-blog-content.component.html',
  styleUrls: ['./add-blog-content.component.css']
})
export class AddBlogContentComponent implements OnInit {

  @Input('content') editContent : [];

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if(!this.editContent)
    this.store.dispatch(new invalidPage());
  }

  

  articlesList  = [];
  storeSub: Subscription;
  currentSelectedArticles = [];

  constructor(private store: Store<fromApp.appState> , private editPageService : EditPageService) { }

  ngOnInit(): void {

    this.storeSub = this.store.select('articles').subscribe(state => {

      this.articlesList = [...state.availableArticles].sort(sortByDate);
      
    });

    if(this.editContent){
      
      if(this.editContent.length > 0) {

        this.editContent.map((item : Article ) => {


         const index = this.articlesList.findIndex(article => article.id === item.id);

         if (index !== -1){
           this.currentSelectedArticles.push(item);
         }


        })

      }

      this.editPageService.content.emit([...this.currentSelectedArticles]);
      if(this.currentSelectedArticles.length === 0){
        this.editPageService.contentValidatiy.emit(false);
      }
    }

  }

  onRowClick = index => {

    const id = this.articlesList[index].id;
    const isChecked = this.currentSelectedArticles.findIndex(item => item.id === id);

    if (isChecked === -1 ){
      this.currentSelectedArticles.push(this.articlesList[index]);
     
    } else {
      this.currentSelectedArticles.splice(isChecked , 1);
    }

      if(this.editContent){
        this.editPageService.content.emit([...this.currentSelectedArticles]);
        this.editPageService.contentValidatiy.emit(this.currentSelectedArticles.length > 0 ? true: false);

      } else {
        this.store.dispatch(new addPageContent([...this.currentSelectedArticles]));
      }
    

  }

  check(id) {
    
    return this.currentSelectedArticles.find(a => a.id === id) ;
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

  
}
