import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-anchor-tag-view-html-render-component',
  templateUrl: './anchor-tag-view-html-render-component.component.html',
  styleUrl: './anchor-tag-view-html-render-component.component.css'
})
export class AnchorTagViewHtmlRenderComponent implements ICellRendererAngularComp{

  public classNameToChild:string = 'handCursor';
  public targetNameToChild:string = '_blank';
  public textValueToChild:string = "";
  public paramToChild:number=0;

  private params: any;

  agInit(params: any): void {
    this.params = params;
    this.textValueToChild = params.data.FileName;
  }

  refresh(): boolean {
    return false;
  }

  onClick(event:any) {
    this.params.context.componentParent.previewDoc(this.params.data.Id, this.params.data.FileId);
  }
}
