import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-tag-comp',
  templateUrl: './select-tag-comp.component.html',
  styleUrl: './select-tag-comp.component.css'
})
export class SelectTagCompComponent implements OnInit {

  @Input() selectOptions: any;
  @Output() selectedValue = new EventEmitter<number>();


  ngOnInit(): void {
  }

  onSelectChange(event){
    this.selectedValue.emit(event.target.value);
  }

}
