import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbCarouselConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManualService } from '../../../services/manual-service/manual.service';
import { ToastNotificationsService } from '../../../services/toast-notification-service/toast-notifications.service';

@Component({
  selector: 'app-add-manual',
  templateUrl: './add-manual.component.html',
  styleUrl: './add-manual.component.css'
})
export class AddManualComponent {

  manualForm!: FormGroup;
  selectedDoc:any;

  @Output() ManualDoc: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public manualService:ManualService,
    public toastNotificationsService: ToastNotificationsService,
    ) {
    this.manualForm = this.fb.group({
      mName: ['', Validators.required],
      mDoc: ['', [Validators.required, this.fileTypeValidator]]
    });
  }

  fileTypeValidator(control: any) {
    const file = control.value;
    if (file) {
      const extension = file.split('.').pop().toLowerCase();
      if (extension !== 'doc' && extension !== 'docx') {
        return { invalidFileType: true };
      }
    }
    return null;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      this.manualForm.patchValue({
        mDoc: fileName
      });
      this.selectedDoc = file;
    }
  }


  onSave() {
    if (this.manualForm.valid) {
      const formData = new FormData();
      formData.append('name', this.manualForm.get('mName')?.value);
      formData.append('Files', (document.getElementById('mDoc') as HTMLInputElement).files?.[0] || '');
      //const doc = this.selectedDoc;
      //formData.append(`Files`, doc);
      formData.append(`created_by`, '2');
      formData.append(`modified_by`, '2');
      formData.append(`id`, '0');
      // Handle form submission
      //console.log('Form Submitted', this.manualForm.value);
      this.manualService.submitManual(formData).subscribe({
        next: (data:any) => {
          this.ManualDoc.emit()
          this.toastNotificationsService.showSuccess('Success!', 'User Manual Succesfully Uploaded.');
          //console.log('Form Submitted', data);
        },
        error:(error:any)=>{
          this.toastNotificationsService.showError('Fail..!', 'Sorry Upload failed..!');
          console.log('error', error);
        }
      });

      this.modal.close();
    }
  }
}
