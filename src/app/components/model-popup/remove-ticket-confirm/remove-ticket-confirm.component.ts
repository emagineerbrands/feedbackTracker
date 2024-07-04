import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbCarouselConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackService } from '../../../services/feedback-service/feedback.service';
import { ReturnsService } from '../../../services/returns-service/returns.service';

@Component({
  selector: 'app-remove-ticket-confirm',
  templateUrl: './remove-ticket-confirm.component.html',
  styleUrls: ['./remove-ticket-confirm.component.css']
})
export class RemoveTicketConfirmComponent implements OnInit{
  @Input() order!: any;
  @Input() orderId!: number;
  @Input() tracker_type!: string;
  @Output() OrderData: EventEmitter<any> = new EventEmitter();
  @Output() ReturnsData: EventEmitter<any> = new EventEmitter();

  constructor(
    private feedbackService: FeedbackService,
    private returnsService: ReturnsService,
    public modal: NgbActiveModal,
  ) {
  }

  ngOnInit(): void {

  }

  async confirmRemovalOrder(){
    const authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');
    const data = {
      "id": this.orderId,
      "Modified_by": authUser.id,
      "is_active": false
    }
    if(this.tracker_type === 'FEEDBACK-TRACKER'){
      await this.feedbackService.inactiveTicket(data).subscribe();
      this.OrderData.emit();
    }else if(this.tracker_type === 'RETURNS-TRACKER'){
      await this.returnsService.deleteticket(data).subscribe();
      this.ReturnsData.emit();
    }

    this.modal.close();
  }
}
