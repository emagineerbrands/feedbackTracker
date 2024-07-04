import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PaginationParams } from '../../../interface/PaginationParams';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  @Input() paginationInfo!:PaginationParams;
  @Output() pageChange = new EventEmitter<any>();

  constructor(){

  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.paginationInfo.TotalPages) {
      this.paginationInfo.CurrentPage = page;
      this.paginationInfo.PageOffset = (this.paginationInfo.CurrentPage*this.paginationInfo.RecordsPerPage  - this.paginationInfo.RecordsPerPage );
      this.pageChange.emit({ PageOffset: this.paginationInfo.PageOffset, CurrentPage: this.paginationInfo.CurrentPage, RecordsPerPage: this.paginationInfo.RecordsPerPage});
    }
  }

  showNumberOfTickets(){
    this.paginationInfo.PageOffset = 0;
    this.paginationInfo.CurrentPage = 1;
    this.pageChange.emit({ PageOffset: this.paginationInfo.PageOffset, CurrentPage: this.paginationInfo.CurrentPage, RecordsPerPage: this.paginationInfo.RecordsPerPage});
  }

}
