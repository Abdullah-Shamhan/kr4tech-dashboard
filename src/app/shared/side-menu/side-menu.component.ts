import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../app.reducer';
import { Subscription , combineLatest } from 'rxjs';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  constructor(private store: Store<fromApp.appState>) { }

  isLoading = false;
  storeSub: Subscription;

  ngOnInit() {

    this.storeSub = combineLatest([this.store.select('page') , this.store.select('articles')]).subscribe(([page , articles]) => {

      if (page.isLoading || articles.isLoading){
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
      
    });


  }


}
