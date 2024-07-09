import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-tag-comp',
  templateUrl: './icon-tag-comp.component.html',
  styleUrl: './icon-tag-comp.component.css'
})
export class IconTagCompComponent {
  @Input() className:any;
}
