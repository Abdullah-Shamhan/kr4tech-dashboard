import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared/shared.module';
import { articlesRoutingModule } from './articles-routing.module';
import { IonicModule } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';
import { AddArticleComponent } from './add-article/add-article.component';



@NgModule({
  declarations: [
    AddArticleComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    articlesRoutingModule,
    IonicModule.forRoot(),
    QuillModule.forRoot(),
  ]
})
export class ArticlesModule { }
