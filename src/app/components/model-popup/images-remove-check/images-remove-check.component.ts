import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbCarouselConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-images-remove-check',
  templateUrl: './images-remove-check.component.html',
  styleUrls: ['./images-remove-check.component.css']
})
export class ImagesRemoveCheckComponent {
  @Output() ImageData: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
  ) {
  }


  confirmRemovalImage(){
    this.ImageData.emit();
    this.modal.close();
  }

}
