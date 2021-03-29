import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SettingsComponent } from './components/settings/settings.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as fromApp from './app.reducer';
import { pageEffects } from './store/pages/page.effects';
import { AngularFireStorageModule , BUCKET } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { articlesEffects } from './store/articles/articles.effects';
import { slidersEffects } from './store/sliders/sliders.effects';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalComponent, NgbdModalContent } from './shared/popUpModal/popup.component';
import { AppContentComponent } from './components/app-content/app-content.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { appContentEffects } from './store/appContent/appContent.effects';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared/shared.module';
import {SlidersModule} from './sliders/sliders.module'
import { ArticlesModule } from './articles/articles.module';

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    NotificationsComponent,
    SettingsComponent,
    NgbdModalComponent,
    NgbdModalContent,
    AppContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([pageEffects , articlesEffects , slidersEffects  , appContentEffects]),
    HttpClientModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgbModalModule,
    DragDropModule,
    PagesModule,
    SharedModule,
    SlidersModule,
    ArticlesModule
  ],
  providers: [ { provide: BUCKET, useValue: environment.firebase.storageBucket } ],
  bootstrap: [AppComponent],
  entryComponents: [NgbdModalContent],
})
export class AppModule { }
