import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-anchor-tag-comp',
  templateUrl: './anchor-tag-comp.component.html',
  styleUrl: './anchor-tag-comp.component.css'
})
export class AnchorTagCompComponent {

  @Input() textValue:any;
  @Input() className:any;
  @Input() param1:any;
  @Input() targetName:string = '';

  @Output() sendValueToParent = new EventEmitter<any>();

  outputToParent(param:any){
    this.sendValueToParent.emit(param);
  }

}
