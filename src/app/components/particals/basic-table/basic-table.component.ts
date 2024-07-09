import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-basic-table',
  templateUrl: './basic-table.component.html',
  styleUrl: './basic-table.component.css'
})
export class BasicTableComponent {

  @Input() tableInfo:any;

  getColumnHeaders(data: any): string[]{
    return Object.keys(data);
  }

}
