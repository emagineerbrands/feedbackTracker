import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-users-roles-list-table-cell-render',
  templateUrl: './users-roles-list-table-cell-render.component.html',
  styleUrl: './users-roles-list-table-cell-render.component.css'
})
export class UsersRolesListTableCellRenderComponent implements ICellRendererAngularComp{

  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return false;
  }

}
