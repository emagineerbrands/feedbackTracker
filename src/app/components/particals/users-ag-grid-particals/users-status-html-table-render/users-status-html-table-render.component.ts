import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-users-status-html-table-render',
  templateUrl: './users-status-html-table-render.component.html',
  styleUrl: './users-status-html-table-render.component.css'
})
export class UsersStatusHtmlTableRenderComponent implements ICellRendererAngularComp{

  public params: any;

  agInit(params: any): void {
    this.params = params.data;
  }



  refresh(params: any): boolean {
    return false;
  }
}
