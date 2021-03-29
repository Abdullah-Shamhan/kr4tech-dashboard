import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AppContentComponent } from './components/app-content/app-content.component';



const routes: Routes = [
    {path: '' , redirectTo: 'pages' , pathMatch: 'full'},
    {path: 'pages' , loadChildren: () => import('./pages/pages-routing.module').then(m => m.pagesRoutingModule)},
    {path: 'sliders' , loadChildren: () => import('./sliders/sliders-routing.module').then(m => m.slidersRoutingModule)},
    {path: 'article' , loadChildren: () => import('./articles/articles-routing.module').then(m => m.articlesRoutingModule)},
    {path: 'notification' , component: NotificationsComponent},
    {path: 'settings' , component: SettingsComponent},
    {path: 'app-content' , component: AppContentComponent},
    {path: '**' , redirectTo : 'pages'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
