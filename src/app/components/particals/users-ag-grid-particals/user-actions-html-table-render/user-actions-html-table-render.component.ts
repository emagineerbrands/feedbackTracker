import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-user-actions-html-table-render',
  templateUrl: './user-actions-html-table-render.component.html',
  styleUrl: './user-actions-html-table-render.component.css'
})
export class UserActionsHtmlTableRenderComponent implements ICellRendererAngularComp{

  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  // Implement your methods here
  updateUser(user: any, rowIndex: number) {
    this.params.context.componentParent.updateUser(user, rowIndex);
  }

  userInactive(user: any, rowIndex: number, status: string, event: any) {
    this.params.context.componentParent.userInactive(user, rowIndex, status, event);
  }

  refresh(params: any): boolean {
    return false;
  }

}
