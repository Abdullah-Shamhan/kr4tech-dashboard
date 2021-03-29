import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { addPageGuard } from '../guard/addPage.guard';
import { PagesComponent } from './components/pages/pages.component';
import { AddPageComponent } from './components/add-page/add-page.component';
import { AddPageFormComponent } from './components/items/add-page-form/add-page-form.component';
import { AddFormContentComponent } from './components/items/add-form-content/add-form-content.component';
import { AddBlogContentComponent } from './components/items/add-blog-content/add-blog-content.component';
import { AddCatalogueContentComponent } from './components/items/add-catalogue-content/add-catalogue-content.component';
import { AddGalleryContentComponent } from './components/items/add-gallery-content/add-gallery-content.component';
import { AddLinkContentComponent } from './components/items/add-link-content/add-link-content.component';
import { AddArticleContentComponent } from './components/items/add-article-content/add-article-content.component';




const routes: Routes = [
    { path : '' , component : PagesComponent } ,
    {path: 'add-page' , component: AddPageComponent  , children: [
      {path : '' , component : AddPageFormComponent },
      {path : 'form-data' , component : AddFormContentComponent  , canActivate: [addPageGuard] },
      {path : 'blog-data' , component : AddBlogContentComponent , canActivate: [addPageGuard]},
      {path : 'catalogue-data/:id' , component : AddCatalogueContentComponent , canActivate: [addPageGuard]},
      {path : 'gallery-data/:id' , component : AddGalleryContentComponent , canActivate: [addPageGuard]},
      {path : 'link-data' , component : AddLinkContentComponent , canActivate: [addPageGuard]},
      {path : 'atricle-data' , component : AddArticleContentComponent , canActivate: [addPageGuard]},
      {path : '**' , redirectTo : ''}
    ]},
]

@NgModule({
    imports :[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class pagesRoutingModule{}

