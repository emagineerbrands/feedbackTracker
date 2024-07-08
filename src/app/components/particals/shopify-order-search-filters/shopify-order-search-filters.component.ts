import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InternalService } from '../../../services/internal-service/internal.service';

@Component({
  selector: 'app-shopify-order-search-filters',
  templateUrl: './shopify-order-search-filters.component.html',
  styleUrl: './shopify-order-search-filters.component.css'
})
export class ShopifyOrderSearchFiltersComponent {
  email: string = '';
  phoneNumber: string = '';
  orderNumber: string = '';
  fieldType: string = '';
  emailValid: boolean = true;

  @Input() searchType: string = '';
  @Input() searchValue: string = '';

  @Output() searchOptions = new EventEmitter<any>();
  constructor(
    public internalService:InternalService
  ){}

  ngOnChanges(): void {
    this.fieldType = this.searchType;
    if (this.searchType === 'email') {
      this.email = this.searchValue;
    } else if (this.searchType === 'phone') {
      this.phoneNumber = this.searchValue;
    } else if (this.searchType === 'order') {
      this.orderNumber = this.searchValue;
    }
    this.canSearch();
  }

  ngOnInit(): void {
    if (this.internalService.shopifyOrderSeachParams.PreviousDataExist) {
      if(this.internalService.shopifyOrderSeachParams.SearchType == 'email'){
        this.email = this.internalService.shopifyOrderSeachParams.SearchValue;
      }else if(this.internalService.shopifyOrderSeachParams.SearchType == 'phone'){
        this.phoneNumber = this.internalService.shopifyOrderSeachParams.SearchValue;
      }else if(this.internalService.shopifyOrderSeachParams.SearchType == 'order'){
        this.orderNumber = this.internalService.shopifyOrderSeachParams.SearchValue;
      }
    }
    this.canSearch();
  }

  clearOthers(changedField: string) {
    this.fieldType = changedField;
    if (changedField === 'email') {
      this.phoneNumber = '';
      this.orderNumber = '';
    } else if (changedField === 'phone') {
      this.email = '';
      this.orderNumber = '';
    } else if (changedField === 'order') {
      this.email = '';
      this.phoneNumber = '';
    }
    this.validateEmail();
  }

  validateEmail() {
    const emailRegex = /\S+@\S+\.\S+/;
    this.emailValid = emailRegex.test(this.email);
  }

  processPhoneNumber() {
    this.phoneNumber = this.phoneNumber.replace(/[^\d]/g, '');
    this.clearOthers('phone');
  }

  showClearButton(): boolean {
    return !!this.email || !!this.phoneNumber || !!this.orderNumber;
  }

  clearAll() {
    this.email = '';
    this.phoneNumber = '';
    this.orderNumber = '';
  }

  canSearch(): boolean {
    return ((this.emailValid && this.email.length > 0) || (this.phoneNumber.length > 0 || this.orderNumber.length > 0));
  }

  searchOrderDetails() {
    // Perform the search operation
    let searchValue = '';
    if (this.fieldType === 'email') {
      searchValue = this.email;
    } else if (this.fieldType === 'phone') {
      searchValue = this.phoneNumber;
    } else if (this.fieldType === 'order') {
      searchValue = this.orderNumber;
    }
    this.searchOptions.emit({'searchType': this.fieldType, 'searchValue':searchValue})
  }

}
