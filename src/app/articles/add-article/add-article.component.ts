import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import idGenerator from 'src/app/shared/idGenerator/idGenerator';
import { Article } from 'src/app/models/article';
import { Store } from '@ngrx/store';
import * as fromApp from '../../app.reducer';
import { storeArticle, deleteArticle, updateArticle } from 'src/app/store/articles/articles.actions';
import { Subscription, combineLatest } from 'rxjs';
import { sortByDate } from 'src/app/shared/listSorting';
import { FullPage } from 'src/app/models/fullPage';
import { generatePage } from 'src/app/store/pages/page.actions';


@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit , OnDestroy {




  articlesList = [];
  articleForm: FormGroup;
  articleDetails = null;
  mode = 'details';  
  htmlEN = '';
  htmlAR = '';
  isLoading  = false;
  storeSub :Subscription;
  editorStyle = {
    height: '480px',
  
  };
  editedArticle;
  isUpdating = false;
  language = 'EN';

  constructor(private store : Store<fromApp.appState> ) { }

  ngOnInit() {

    this.formInit();

    this.storeSub = combineLatest([this.store.select('articles') , this.store.select('page')]).subscribe(([articles , pages]) => {

      this.articlesList = [...articles.availableArticles].sort(sortByDate);

      if (articles.isLoading || pages.isLoading){

        this.isLoading = true;
      } else {
        this.isLoading = false;
      }

     
    });



  }

  formInit () {

    this.articleForm = new FormGroup({
      enTitle : new FormControl('' , [Validators.required]),
      arTitle : new FormControl('' , [Validators.required]),
      enDescription : new FormControl('' , [Validators.required]),
      arDescription : new FormControl('' , [Validators.required]),
    });


}

onSubmit() {

  if (this.mode === 'details' || this.mode === 'editing'){
this.articleDetails = {
  id : this.mode === 'editing' ? this.editedArticle.id : idGenerator(),
  enTitle : this.articleForm.get('enTitle').value,
  arTitle : this.articleForm.get('arTitle').value,
  enDescription : this.articleForm.get('enDescription').value,
  arDescription : this.articleForm.get('arDescription').value,
  dateAdded : new Date().toLocaleDateString()
}

this.isUpdating = this.mode === 'editing' ? true : false;
this.mode = 'article';
}

else {

  const newArticle = new Article(this.articleDetails.id , this.articleDetails.enTitle , this.articleDetails.arTitle ,
    this.articleDetails.enDescription  , this.articleDetails.arDescription , this.articleDetails.dateAdded , this.htmlEN , this.htmlAR );

    if(this.isUpdating){
      this.store.dispatch(new updateArticle(newArticle));

    } else {
      this.store.dispatch(new storeArticle(newArticle));

      
    }
  
  
    this.onReset();
   
}


}

onReset() {
this.mode = 'details';
this.htmlAR = '';
this.htmlEN = '';
this.isUpdating = false;
this.articleForm.reset();
this.editedArticle = null;
this.language = 'EN'
}


ngOnDestroy(){

  if(this.storeSub){
    this.storeSub.unsubscribe();
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

onEdit(article){
  this.mode = 'editing';
  this.articleForm.get('enTitle').setValue(article.enTitle);
  this.articleForm.get('arTitle').setValue(article.arTitle);
  this.articleForm.get('enDescription').setValue(article.enDescription);
  this.articleForm.get('arDescription').setValue(article.arDescription);
  this.editedArticle = article;

  this.htmlEN = article.htmlContentEN;
  this.htmlAR = article.htmlContentAR;
}

onGenerate(article: Article) {

  const page  = new FullPage(idGenerator() ,article.enTitle ,article.arTitle ,article.enDescription , article.arDescription, 
    'icon' , 'small' , '#0dace6' , 'https://firebasestorage.googleapis.com/v0/b/kr-app-49b1f.appspot.com/o/icon%2Farticle_48dp.png?alt=media&token=915d3c90-9fec-4229-9fbe-37671932b6ba' , 
    'free' , 'article' , [article] , new Date().toLocaleDateString());

  this.store.dispatch(new generatePage(page));

}


onDelete(articleId){
  this.store.dispatch(new deleteArticle(articleId));

}


languageChanged(val){

  this.language = val;


}

}
