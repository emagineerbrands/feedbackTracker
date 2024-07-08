import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { FeedbackTrackerComponent } from './components/feedback/feedback-tracker/feedback-tracker.component';
import { ShopifyOrderSearchComponent } from './components/feedback/shopify-order-search/shopify-order-search.component';
import { ReturnsOrderSearchComponent } from './components/returnsTracker/returns-order-search/returns-order-search.component';
import { ReturnsTrackerListComponent } from './components/returnsTracker/returns-tracker-list/returns-tracker-list.component';
import { ShippingTrackerComponent } from './components/returnsTracker/shipping-tracker/shipping-tracker.component';

const routes: Routes = [
  {
    path: 'order-issues-tracker',
    component: FeedbackListComponent
  },
  {
    path: 'orders_search',
    component: ShopifyOrderSearchComponent
  },
  {
    path:'FeedBackPage',
    component:FeedbackTrackerComponent
  },
  {
    path: 'returns',
    component: ReturnsTrackerListComponent
  },
  {
    path: 'returns_order_search',
    component: ReturnsOrderSearchComponent
  },
  {
    path: 'shipping_tracker',
    component: ShippingTrackerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
