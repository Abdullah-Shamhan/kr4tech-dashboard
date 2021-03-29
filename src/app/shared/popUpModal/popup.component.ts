import { Component, Input} from '@angular/core';
import { NgbActiveModal   } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-modal-popup',
    templateUrl: './popup.html'
  })
  export class NgbdModalContent {
    @Input() message;
    
    constructor(private activeModal: NgbActiveModal) {}

    onClose(){
        this.activeModal.close();
    }
  }
  
  @Component({
    selector: 'ngbd-modal-popup',
    templateUrl: './popup.html'
  })
  export class NgbdModalComponent {
    constructor(private activeModal: NgbActiveModal) {}
    @Input() message;

    onClose(){
        this.activeModal.close();
    }

  }