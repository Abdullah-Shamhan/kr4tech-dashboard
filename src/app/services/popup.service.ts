import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from 'src/app/shared/popUpModal/popup.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private modalService: NgbModal) { }


  showMessage(message: string){

    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.message = message;

  }


}
