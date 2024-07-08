import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-images-remove-check',
  templateUrl: './images-remove-check.component.html',
  styleUrl: './images-remove-check.component.css'
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
