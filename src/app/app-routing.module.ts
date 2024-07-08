import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { FeedbackTrackerComponent } from './components/feedback/feedback-tracker/feedback-tracker.component';
import { ShopifyOrderSearchComponent } from './components/feedback/shopify-order-search/shopify-order-search.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
