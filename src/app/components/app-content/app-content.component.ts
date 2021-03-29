import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {
  CdkDrag,
  CdkDragStart,
  CdkDropList, CdkDropListGroup, CdkDragMove, CdkDragEnter,
  moveItemInArray
} from "@angular/cdk/drag-drop";
import {ViewportRuler} from "@angular/cdk/overlay";
import { Store } from '@ngrx/store';
import * as fromApp from '../../app.reducer';
import { Subscription } from 'rxjs';
import * as contentActions  from 'src/app/store/appContent/appContent.actions';
import { updateAll } from 'src/app/store/appContent/appContent.actions';
import $ from 'jquery';

@Component({
  selector: 'app-app-content',
  templateUrl: './app-content.component.html',
  styleUrls: ['./app-content.component.css']
})
export class AppContentComponent implements OnInit  , OnDestroy{

  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;
  
  constructor(private viewportRuler: ViewportRuler ,  private store: Store<fromApp.appState>) {
    this.target = null;
    this.source = null;
   }

  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  public activeContainer;
  storeSub: Subscription;
  items = [];
  isLoading = false;


  ngOnInit(): void {

    this.storeSub =this.store.select('appContent').subscribe(state => {

      try {
        this.items =[...state.currentContent];
      } catch (err) {}

      this.isLoading = state.isLoading;

    });

  }

  onSave(){
   
    this.store.dispatch(new contentActions.saveContentInnDb(this.items) );

  }

  onRemove(id){

    this.store.dispatch(new contentActions.removeContent(id));

  }

  stylingBoxes = item => {

    let styleObj = {};

    if(item.buttonColor ){

      styleObj = {...styleObj , 'backgroundColor' : item.buttonColor }

    } 

    if(item.buttonSize === 'medium' || item.name) {
      styleObj = {...styleObj , 'width' : '263px' , 'font-size' : '23px' }
    } else if (item.buttonSize === 'large'){
      styleObj = {...styleObj , 'width' : '263px' , 'height' : '200px' , 'font-size' : '25px' }
    } 

    if(item.buttonType === 'image' ){
      
      styleObj = {...styleObj , 'background-image' : `url("${ item.imageUrl}")` , 'background-repeat': 'no-repeat' , 'background-size' : '100% 100%' , 'backgroundColor' :'#bfbfbf' }
    }

    if(item.name){
      // const images = item.content.map(i => i.image);
      // const node  = document.getElementById(item.id);

      // if(node && images.length > 1){
      //  //this.imageChanger(item.id , images)
      // }
      styleObj = {...styleObj , 'background-image' : `url("${ item.content[0].image} ")` ,   'background-repeat': 'no-repeat' ,  'background-size' : '100% 100%' , 'backgroundColor' :'#bfbfbf' }

    }

    if(item.id === 'whatsapp'){
      styleObj = { 'height' : '50px' , 'font-size' : '16px' , 'backgroundColor' :'#25D366'  }
    }

    if(item.id === 'instagram'){
      styleObj = { 'height' : '50px' , 'font-size' : '16px' , 'backgroundColor' :'#795a80'  }
    }

    return styleObj;

  }


  // imageChanger(id: string , images: string[]){

  //   $(function () {
  //     let i = 0;
  //     $("#" + id).css("background-image", "url(" + images[i] + ")");
  //     setInterval(function () {
  //         i++;
  //         if (i == images.length) {
  //             i = 0;
  //         }
  //         $("#" + id).fadeOut("slow", function () {
  //             $(this).css("background-image", "url(" + images[i] + ")");
  //             $(this).fadeIn("slow");
  //         });
  //     }, 3000);
  // });

  // }


  ngAfterViewInit() {

    
      // let phElement = this.placeholder.element.nativeElement;
      // phElement.style.display = 'none';
      // phElement.parentElement.removeChild(phElement);
    
  }

  updateAll(){

    this.store.dispatch(new updateAll());


  }



  dragMoved(e: CdkDragMove) {
    let point = this.getPointerPositionOnPage(e.event);

    this.listGroup._items.forEach(dropList => {
      if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
        this.activeContainer = dropList;
        return;
      }
    });
    
  }

  dropListDropped() {
    if (!this.target)
      return;

    let phElement = this.placeholder.element.nativeElement;
    let parent = phElement.parentElement;

    phElement.style.display = 'none';

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

    this.target = null;
    this.source = null;

    if (this.sourceIndex != this.targetIndex)
      moveItemInArray(this.items, this.sourceIndex, this.targetIndex);

      
  }

  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop == this.placeholder)
      return true;

    if (drop != this.activeContainer)
      return false;

    let phElement = this.placeholder.element.nativeElement;
    let sourceElement = drag.dropContainer.element.nativeElement;
    let dropElement = drop.element.nativeElement;

    let dragIndex = __indexOf(dropElement.parentElement.children, (this.source ? phElement : sourceElement));
    let dropIndex = __indexOf(dropElement.parentElement.children, dropElement);

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = sourceElement.clientWidth + 'px';
      phElement.style.height = sourceElement.clientHeight + 'px';
      
      sourceElement.parentElement.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    dropElement.parentElement.insertBefore(phElement, (dropIndex > dragIndex 
      ? dropElement.nextSibling : dropElement));

    this.placeholder.enter(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
    return false;
  }
  
  
  getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
    
    const point = __isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
        const scrollPosition = this.viewportRuler.getViewportScrollPosition();

        return {
            x: point.pageX - scrollPosition.left,
            y: point.pageY - scrollPosition.top
        };
    }

ngOnDestroy(){

  if(this.storeSub) {
    this.storeSub.unsubscribe();
  }
}

}

function __indexOf(collection, node) {
  return Array.prototype.indexOf.call(collection, node);
};


function __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return event.type.startsWith('touch');
}

function __isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
  const {top, bottom, left, right} = dropList.element.nativeElement.getBoundingClientRect();
  return y >= top && y <= bottom && x >= left && x <= right; 
}
