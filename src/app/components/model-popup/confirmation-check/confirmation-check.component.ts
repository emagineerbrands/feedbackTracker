import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-check',
  templateUrl: './confirmation-check.component.html',
  styleUrl: './confirmation-check.component.css'
})
export class ConfirmationCheckComponent {


  @Input() data!: string;

  @Output() OutputData: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
  ) { }

  confirm(){
    this.OutputData.emit();
    this.modal.close();
  }

}
