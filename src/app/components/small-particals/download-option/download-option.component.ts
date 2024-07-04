import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-download-option',
  templateUrl: './download-option.component.html',
  styleUrl: './download-option.component.css'
})
export class DownloadOptionComponent {


  @Output() downloadType = new EventEmitter<string>();

  userDetails:any;
  constructor(){
    this.userDetails = JSON.parse(localStorage.getItem('authDetails') || 'null');
  }

  exportData(type:string){
    this.downloadType.emit(type);
  }
}
