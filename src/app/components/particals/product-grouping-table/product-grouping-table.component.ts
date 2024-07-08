import { Component, Input } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FeedbackService } from '../../../services/feedback-service/feedback.service';
import { InternalService } from '../../../services/internal-service/internal.service';
import { Group } from '../../../models/group';
import { Item } from '../../../models/item';

@Component({
  selector: 'app-product-grouping-table',
  templateUrl: './product-grouping-table.component.html',
  styleUrl: './product-grouping-table.component.css'
})
export class ProductGroupingTableComponent {
  @Input() allProducts:any;
  @Input() email:any;
  @Input() order_number:any;
  @Input() phone:any;
  @Input() ifOrderIdSearch!:boolean;

  allProductsRef:Group[] = [];
  selectedGroup: string = '';
  selectedItems: Item[] = [];
  selectedOrderItems:number = 0;

  itemIds:number[] = [];
  constructor(
    public feedbackService:FeedbackService,
    public config: NgbCarouselConfig,
    public internalService: InternalService,
    private router: Router,

    ) {
    config.interval = 0;
    config.keyboard = true;
    config.pauseOnHover = true;
    this.internalService.orderSelectedSKUs = [];
  }

  editClicked(product: any, issueCat: string) {
    this.internalService.editStatus = false;
    this.internalService.feedbackForm.email = product.email;
    const selectedSKUs = this.internalService.orderSelectedSKUs[product.order_number];
    if (selectedSKUs && selectedSKUs.length > 0) {
      this.internalService.feedbackForm.SKU = selectedSKUs.join(',');
    }else {
      this.internalService.feedbackForm.SKU = issueCat;
    }
    if(!product.email){
      this.internalService.feedbackForm.email='Not Available';
    }
    if(product.phone){
      this.internalService.feedbackForm.phoneNumber = product.phone
    }
    if(product.shipping_address?.phone){
      this.internalService.feedbackForm.phoneNumber = product.shipping_address.phone
    }
    if(product.customer?.phone){
      this.internalService.feedbackForm.phoneNumber = product.customer.phone
    }
    if(product.billing_address?.phone){
      this.internalService.feedbackForm.phoneNumber = product.billing_address.phone
    }


    this.internalService.itemsCount = product.line_items.length;

    this.internalService.countryCode = (product.shipping_address?.country_code) ? product.shipping_address.country_code : '';

    this.internalService.feedbackForm.order_number = product.order_number;
    // Check if SKU is 'FULL-ORDER' and set an additional parameter if needed
    let queryParams: any = {
      'email': this.internalService.feedbackForm.email,
      'orderId': product.order_number,
      'phone': this.internalService.feedbackForm.phoneNumber,
      'itemsCount': product.line_items.length,
      'customerId': product.customer?.id,
      'orderUniqId': (product.po_number && product.po_number !== "") ? product.po_number : product.id,
      'country': (product.shipping_address?.country_code) ? product.shipping_address.country_code : ''
    };

    if (this.internalService.feedbackForm.SKU === 'FULL-ORDER') {
      // Gather all SKUs from the order
      const allSKUsFromOrder = product.line_items.map((item: any) => item.sku);
      queryParams = {
        ...queryParams,
        'allSKUs': allSKUsFromOrder.join(','),
        'skus': 'FULL-ORDER'
      };
    } else {
      queryParams = {
        ...queryParams,
        'skus': this.internalService.feedbackForm.SKU
      };
    }

    // Navigate to the URL with the updated queryParams
    this.router.navigate(['/FeedBackPage'], {
      queryParams: queryParams
    });
  }

  ngOnInit(): void {

  }



  getShopifyOrderLink(product: any) {
   // return 'https://admin.shopify.com/store/honest-ppe-supply/orders/'+product.id;
  }

  getShopifyCustomerLink(product: any) {
    //return 'https://admin.shopify.com/store/honest-ppe-supply/customers/'+product.customer.id;
  }

  selectlineItem($event: { target: { checked: any; }; }, SKU: any, orderNumber: number) {
    if (!this.internalService.orderSelectedSKUs[orderNumber]) {
      this.internalService.orderSelectedSKUs[orderNumber] = [];
    }

    if ($event.target.checked) {
      this.internalService.orderSelectedSKUs[orderNumber].push(SKU);
    } else {
      const index = this.internalService.orderSelectedSKUs[orderNumber].indexOf(SKU);
      if (index !== -1) {
        this.internalService.orderSelectedSKUs[orderNumber].splice(index, 1);
      }
    }
  }

  getUserEmail(product: any){
    let email = '';
    if(product.email !== '' && product.email){
      email = product.email;
    }
    if(product.customer.email !== '' && product.customer.email){
      email = product.customer.email;
    }
    return email;
  }

}
