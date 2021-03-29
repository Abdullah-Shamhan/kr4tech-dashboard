import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { pagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './components/pages/pages.component';
import { AddPageComponent } from './components/add-page/add-page.component';
import { AddPageFormComponent } from './components/items/add-page-form/add-page-form.component';
import { AddGalleryContentComponent } from './components/items/add-gallery-content/add-gallery-content.component';
import { AddCatalogueContentComponent } from './components/items/add-catalogue-content/add-catalogue-content.component';
import { AddFormContentComponent } from './components/items/add-form-content/add-form-content.component';
import { AddBlogContentComponent } from './components/items/add-blog-content/add-blog-content.component';
import { AddLinkContentComponent } from './components/items/add-link-content/add-link-content.component';
import { AddArticleContentComponent } from './components/items/add-article-content/add-article-content.component';
import { EditPageComponent } from './components/items/edit-page/edit-page.component';
import { SharedModule } from '../shared/shared/shared.module';



@NgModule({
  declarations: [
    PagesComponent,
    AddPageComponent,
    AddPageFormComponent,
    AddGalleryContentComponent,
    AddCatalogueContentComponent,
    AddFormContentComponent,
    AddBlogContentComponent,
    AddLinkContentComponent,
    AddArticleContentComponent,
    EditPageComponent,

  ],
  imports: [
    RouterModule,
    pagesRoutingModule,
    SharedModule
  ]
})
export class PagesModule { }
