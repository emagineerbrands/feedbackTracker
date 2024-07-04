import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbCarouselConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserStatus } from '../../../enum/user-status.enum';
import { FeedbackService } from '../../../services/feedback-service/feedback.service';
import { ToastNotificationsService } from '../../../services/toast-notification-service/toast-notifications.service';

@Component({
  selector: 'app-user-remove',
  templateUrl: './user-remove.component.html',
  styleUrls: ['./user-remove.component.css']
})
export class UserRemoveComponent {

  @Input() userDetails: any;
  @Input() userEmail!: string;
  @Input() userDetailsString!: string;

  @Output() UserData: EventEmitter<any> = new EventEmitter();
  @Output() noChange: EventEmitter<any> = new EventEmitter();

  userStatus = UserStatus;

  constructor(
    private feedbackService: FeedbackService,
    public modal: NgbActiveModal,
    public toastNotificationsService: ToastNotificationsService,
  ) {
  }

  async removeUser(){
    await this.feedbackService.userInactivate(this.userDetails).subscribe((res:any) => {
      //const text = this.userDetails.user_status=="2" ? "Deleted" : (this.userDetails.user_status=="1" ? "Activated" : "Inactivated");
      let text = '';
      switch (this.userDetails.user_status) {
        case UserStatus.Deleted:
          text = 'Deleted';
          break;
        case UserStatus.Active:
          text = 'Activated';
          break;
        default:
          text = 'Inactivated';
      }
      this.toastNotificationsService.showSuccess('Success!', 'User Successfully ' + text);

    });
    this.UserData.emit({userdata:this.userDetails});
    this.modal.close();
  }

  nochange(){
    this.noChange.emit();
    this.modal.close();
  }

}
