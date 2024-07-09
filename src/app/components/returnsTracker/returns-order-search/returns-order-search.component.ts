import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { FilteringSKUsModule } from '../../../enum/FilteringSKUsModule.enum';
import { InternalService } from '../../../services/internal-service/internal.service';
import { ReturnsService } from '../../../services/returns-service/returns.service';

@Component({
  selector: 'app-returns-order-search',
  templateUrl: './returns-order-search.component.html',
  styleUrl: './returns-order-search.component.css'
})
export class ReturnsOrderSearchComponent implements OnInit {

  pageTitle:string = 'Returns Order Search';
  breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': 'Returns Tracker Details', 'link': 'returns', 'status':'inactive'},
    {'title': this.pageTitle, 'link': 'returns_order_search', 'status':'active'},
  ];

  orderNumber!:number;
  orderSkus:any[] = [];

  orderData:any;
  private filteringSKUsModule = FilteringSKUsModule;

  private queryParamsSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private returnsService:ReturnsService,
    private activatedRoute: ActivatedRoute,
    public internalService:InternalService
  ){
    this.queryParamsSubscription = this.activatedRoute.queryParams.pipe(take(1)).subscribe(params => {
      this.orderNumber = params['orderNumber'];
      this.searchOrderByParam(this.orderNumber);
    });
    //this.searchOrders();
  }

  ngOnInit(): void {
    //this.triggerSnapshot();
  }

  ngOnDestroy(): void {
    if(this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }



  searchOrders(){
    const redirectPageUrl = this.router.createUrlTree(['/returns_order_search'], { queryParams: {'orderNumber': this.orderNumber }  }).toString();
    this.searchOrderByParam(this.orderNumber);
    // Navigate to the URL
    this.router.navigateByUrl(redirectPageUrl);

  }

  searchOrderByParam(orderNumber: number) {
    this.returnsService.getOrderByOrderNumber(orderNumber).subscribe({
      next:(data)=>{
        this.orderData = data.orders
        .filter((order: { orderNumber: any; }) => order.orderNumber === orderNumber)
        .map((order: { items: any[]; }) => {
          // Modify the items array in-place to filter out items with empty SKU
          order.items = order.items.filter((item: any) => this.internalService.getInvalidSKU(this.filteringSKUsModule.ReturnsTracker, item.sku));
          return order; // Return the modified order
        });
      },
      error:(error)=>{
        this.orderData = [];
        console.error('There was an error!', error);
      }
    });
  }

  shipingTracker(orderId: any){
    const sku = (this.orderSkus[this.orderNumber]?.length > 0) ? this.orderSkus[this.orderNumber].join(',') : 'FULL-ORDER';
    this.router.navigate(['shipping_tracker'], { queryParams: {'orderId':orderId,'orderNumber': this.orderNumber, 'sku': sku } });
  }

  navigateHomePgae(){
    const authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');
    if(authUser.role_id.includes(4)){
      this.router.navigate(['/returns']);
    }else{
      this.router.navigate(['/order-issues-tracker']);
    }
  }

  selectlineItem(event:any, item:any, orderNumber:number){

    if (!this.orderSkus[this.orderNumber]) {
      this.orderSkus[this.orderNumber] = [];
    }
    if (event.target.checked) {
      this.orderSkus[this.orderNumber].push(item.orderItemId);
    } else {
      const index = this.orderSkus[this.orderNumber].indexOf(item.orderItemId);
      if (index !== -1) {
        this.orderSkus[this.orderNumber].splice(index, 1);
      }
    }

  }

}
