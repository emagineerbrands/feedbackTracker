import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbCarouselConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackService } from '../../../services/feedback-service/feedback.service';
import { ToastNotificationsService } from '../../../services/toast-notification-service/toast-notifications.service';

interface UserRole {
  id: number;
  role: string;
  selected:boolean; // Optional property
}

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
})
export class UserAddComponent implements OnInit {


  domainsList = ["wellbefore.com", "sails.solutions", "emagineer.com", "performanceagency.com", "emagineerbrands.com"];
  usersRole:UserRole[]=[];

  @Input() userDetails: any;
  userdata: { email: string; role_id: number[]; created_by: number; modified_by: number } = {'email':'', 'role_id':[], 'created_by':0, 'modified_by': 0};
  @Output() UserData: EventEmitter<any> = new EventEmitter();
  selectedRoles:number[] = [];

  constructor(
    private feedbackService: FeedbackService,
    public modal: NgbActiveModal,
    public toastNotificationsService: ToastNotificationsService,
  ) {
  }

  ngOnInit(): void {
    this.userdata.role_id = this.userDetails.role;
    if(this.userDetails.userId !== 0){
      this.userdata.role_id = this.userDetails.role;
      this.usersRole.forEach(role => {
        if(this.userDetails.role.includes(role.id)){
          role.selected = true;
        }else{
          role.selected = false;
        }
      });
      this.userdata.email = this.userDetails.email;
    }else{
      this.usersRole.map((user:UserRole) => user.selected = false);
    }
  }



  addUser() {
    this.userdata.role_id = this.selectedRoles = this.usersRole.filter(role => role.selected).map(role => role.id);
    const authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');

    // Trim the email address
    this.userdata.email = this.userdata.email.trim();

    // Check if email is empty
    if (!this.userdata.email) {
      this.toastNotificationsService.showError('Fail..!', 'Email cannot be empty.');
      return; // Exit the function
    }

    // Check if the email domain is in the domainsList
    const emailDomain = this.userdata.email.split('@')[1];
    if (!this.domainsList.includes(emailDomain)) {
      this.toastNotificationsService.showError('Fail..!', 'Email domain is not allowed.');
      return; // Exit the function
    }

    // Check if role_id is 0
    if (this.userdata.role_id.length === 0) {
      this.toastNotificationsService.showError('Fail..!', 'Role ID cannot be 0.');
      return; // Exit the function
    }

    // Set created_by and modified_by
    this.userdata.created_by = this.userdata.modified_by = authUser.id;

    let sendData:any = {};
    sendData = this.userdata;
    if(this.userDetails.userId !== 0){
      sendData = {};
      sendData.id = this.userDetails.userId;
      sendData.role_id = this.userdata.role_id;
      sendData.modified_by = authUser.id;
    }
    // Make the API call if all checks pass
    this.feedbackService.insertUser(sendData).subscribe((data: any) => {
      if(this.userDetails.userId == 0){
        if (data.StatusCode == 200) {
          this.toastNotificationsService.showSuccess('Success!', 'User Details Inserted.');
        } else if (data.StatusCode == 400) {
          this.toastNotificationsService.showError('Fail..!', 'Sorry! User Already Exists.');
        }
      }else{
        this.toastNotificationsService.showSuccess('Success!', 'User Role Changed Succesfully..!');
      }

      this.UserData.emit({userdata:this.userdata, usersRole:this.usersRole.filter(role => role.selected).map(role => role.role)});
    });

    this.modal.close();
  }

  slectRoles(index:number, event:any){
    const selectedRoleId = event.target.value;
    if(event.target.value == 1 || event.target.value == 2){

      this.usersRole.map((user:UserRole) => {
        if(user.id != selectedRoleId){
          user.selected = false;
        }
      });
    }else{
      this.usersRole = this.usersRole.map(role => {
        if (role.id === 1 || role.id === 2) {
          // Set selected to false for id 1 and id 2
          return { ...role, selected: false };
        }
        return role;
      });
    }

  }


}
