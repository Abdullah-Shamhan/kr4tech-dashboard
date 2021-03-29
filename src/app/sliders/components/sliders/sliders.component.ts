import { Component, OnInit, OnDestroy } from '@angular/core';
import { Slider } from 'src/app/models/slider';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/app.reducer';
import { Subscription  , combineLatest} from 'rxjs';
import { deleteSlider, postSlider, fetchSliders } from 'src/app/store/sliders/sliders.actions';
import { addContent } from 'src/app/store/appContent/appContent.actions';
import { PopupService } from 'src/app/services/popup.service';
import * as sortLsit from 'src/app/shared/listSorting';
import { EditSlidersService } from 'src/app/services/edit-slider.service';

@Component({
  selector: 'app-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.css']
})
export class SlidersComponent implements OnInit , OnDestroy {

  constructor(private store: Store<fromApp.appState> ,  private popup: PopupService , private editSliderSrvs: EditSlidersService) { }

  storeSub : Subscription;
  isLoading = false;
  slidersList : Slider[];
  appContentList = [];
  isEditing = false;
  editedSlider : Slider;

  srvsContent = [];
  srvsSliderName = '';
  srvsContentValidity = true;
  srvsNameValidity = true;
  srvsContentSub : Subscription;
  ssrvsSliderNameSub : Subscription;
  srvsContentValiditySub : Subscription;
  srvsSliderNameValiditySub : Subscription;

  ngOnInit(): void {
    
    this.storeSub = combineLatest([this.store.select('sliders') , this.store.select('appContent')]).subscribe(([sliders , appContent]) => {

      this.isLoading = sliders.isLoading;
      this.slidersList = sliders.availableSliders.slice().sort(sortLsit.sortByDate);
      this.appContentList = appContent.currentContent;

    });

    this.srvsContentSub= this.editSliderSrvs.content.subscribe(val => this.srvsContent = [...val] );
    this.ssrvsSliderNameSub = this.editSliderSrvs.sliderName.subscribe(val => this.srvsSliderName = val );
    this.srvsContentValiditySub = this.editSliderSrvs.contentValidatiy.subscribe(val => this.srvsContentValidity = val );
    this.srvsSliderNameValiditySub = this.editSliderSrvs.sliderNameValidity.subscribe(val => this.srvsNameValidity = val );


  }

  onDelete(id) {

    let index = -1;
    if (this.appContentList){
      index = this.appContentList.findIndex(item => item.id === id);
    }
   
    if(index === -1){
      this.store.dispatch(new deleteSlider({id : id , withImages : true}));
    } else {
      this.store.dispatch(new deleteSlider({id : id , withImages : false}));
    }
   
  }


  ngOnDestroy(){

    if(this.storeSub)
      this.storeSub.unsubscribe();
    
      if( this.srvsContentSub)
      this.srvsContentSub.unsubscribe();

      if(this.ssrvsSliderNameSub)
      this.ssrvsSliderNameSub.unsubscribe();

      if(this.srvsContentValiditySub)
      this.srvsContentValiditySub.unsubscribe();

      if(this.srvsSliderNameValiditySub)
      this.srvsSliderNameValiditySub.unsubscribe();


  }


  onAddtoApp = item => {

    this.store.dispatch(new addContent(item));
    this.popup.showMessage(item.name + ' added/updated successfully!!');
    
  }


  onSort(value) {

    switch(value){
      
      case 'name':
       this.slidersList.sort(sortLsit.sortByName);
       break;
      case 'date':
        this.slidersList.sort(sortLsit.sortByDate);
        break;
      default:
        this.slidersList.sort(sortLsit.sortByDate);

    }
  }

  onEdit(slider : Slider){

    
    this.isEditing = true;
    this.editedSlider = slider;
  }

  onCancel(){
    this.isEditing = false;
    this.editedSlider = null;
    this.editSliderSrvs.cancel();
  }

  onSave(){

    const updatedSlider = new Slider(this.editedSlider.id , this.srvsSliderName , new Date().toLocaleDateString() , this.srvsContent)

    this.store.dispatch(new postSlider(updatedSlider));

    this.onCancel();
  }
}
