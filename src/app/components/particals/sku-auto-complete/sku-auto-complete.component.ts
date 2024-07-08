import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sku-auto-complete',
  templateUrl: './sku-auto-complete.component.html',
  styleUrl: './sku-auto-complete.component.css'
})
export class SkuAutoCompleteComponent {

  @Input() skuData: any;
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() disabled: boolean = false;
  @Input() ShowSKUError: boolean = false;
  @Input() inputModel: string = '';
  @Output() inputModelChange = new EventEmitter<string>();
  @Output() skuSelected = new EventEmitter<{ sku: string, index: number }>();

  showSkuSuggestion: boolean = false;
  filteredSkusList: string[] = [];

  autosku(event: any) {
    const value = event.target.value.trim();

    if (value.length < 2) {
      this.showSkuSuggestion = false;
      return;
    }

    this.showSkuSuggestion = true;
    this.filteredSkusList = this.skuData
      .filter((option: string) => option.toLowerCase().startsWith(value.toLowerCase()))
      .sort();
    this.showSkuSuggestion = (this.filteredSkusList.length > 0);
  }

  selectedSku(sku: string) {
    this.inputModel = sku;
    this.showSkuSuggestion = false;
    this.inputModelChange.emit(sku);
    this.skuSelected.emit({ sku, index: this.skuData.index });
  }

  clearSkuList() {
    this.showSkuSuggestion = false;
  }

}
