import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './app.reducer';
import * as pageActions from './store/pages/page.actions';
import * as articlesActions from './store/articles/articles.actions';
import { fetchSliders } from './store/sliders/sliders.actions';
import { fetchContent } from './store/appContent/appContent.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

constructor( private store: Store<fromApp.appState>){

this.store.dispatch(new pageActions.fetchPages());
this.store.dispatch(new articlesActions.fetchArticles());
this.store.dispatch(new fetchSliders());
this.store.dispatch(new fetchContent());

}
  
}
