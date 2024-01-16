import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-small-box',
  templateUrl: './small-box.component.html',
  styleUrl: './small-box.component.css'
})
export class SmallBoxComponent {

  @Input() count:number = 0;
  @Input() title:string = '';
  @Input() bgColor:string = '';
  @Input() icon:string = '';
  @Input() link:string = '';


  pageNavigation(page:string){

  }

}
