import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-call-logs-anchor-tag-view-html-render',
  templateUrl: './call-logs-anchor-tag-view-html-render.component.html',
  styleUrl: './call-logs-anchor-tag-view-html-render.component.css'
})
export class CallLogsAnchorTagViewHtmlRenderComponent implements ICellRendererAngularComp{

  public classNameToChild:string = 'handCursor';
  public targetNameToChild:string = '_blank';
  public textValueToChild:string = "";
  public paramToChild:number=0;

  private params: any;

  agInit(params: any): void {
    this.params = params;
    this.textValueToChild = params.data?.json_data.shopify_order_json.order_number;
  }

  refresh(): boolean {
    return false;
  }

  onClick(event) {
    this.params.context.componentParent.pageNavigate(this.params.data.latest_ticket_id);
  }
}
