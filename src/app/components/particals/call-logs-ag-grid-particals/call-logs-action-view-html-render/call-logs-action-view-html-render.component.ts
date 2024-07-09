import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-call-logs-action-view-html-render',
  templateUrl: './call-logs-action-view-html-render.component.html',
  styleUrl: './call-logs-action-view-html-render.component.css'
})
export class CallLogsActionViewHtmlRenderComponent implements ICellRendererAngularComp{

  private params: any;

  agInit(params: any): void {
    this.params = params;
  }

  // Implement your click handler
  onClick(event:any) {
    this.params.context.componentParent.pageNavigate(this.params.data.latest_ticket_id);
  }

  refresh(): boolean {
    return false;
  }

}
