import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-action-view-html-render',
  templateUrl: './action-view-html-render.component.html',
  styleUrl: './action-view-html-render.component.css'
})
export class ActionViewHtmlRenderComponent implements ICellRendererAngularComp{



  authUser:any;

  classes:string[] = [
    'fas fa-eye',
    'fas fa-trash ml-2'
  ]

  public params: any;

  agInit(params: any): void {
    this.authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  previewDoc(id:number, fileId:string){
    this.params.context.componentParent.redirectToPreviewManual(id, fileId);
  }

  deleteDoc(file:any){
    this.params.context.componentParent.deleteManual(file);
  }
}
