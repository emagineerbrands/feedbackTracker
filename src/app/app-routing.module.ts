import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { FeedbackTrackerComponent } from './components/feedback/feedback-tracker/feedback-tracker.component';
import { ShopifyOrderSearchComponent } from './components/feedback/shopify-order-search/shopify-order-search.component';
import { AuthGuard } from './services/auth-guard/auth.guard';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CallLogsDashboardComponent } from './components/wellcome-call-logs/call-logs-dashboard/call-logs-dashboard.component';
import { CallLogsComponent } from './components/wellcome-call-logs/call-logs/call-logs.component';
import { CallLogsTrackerComponent } from './components/wellcome-call-logs/call-logs-tracker/call-logs-tracker.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'order-issues-tracker',
    component: FeedbackListComponent,
    canActivate: [AuthGuard],
    data: { requiredPrivilege: ['ADMIN', 'FEEDBACK_TRACKER', 'TEAM_LEAD'] },
  },
  {
    path: 'orders_search',
    component: ShopifyOrderSearchComponent,
    canActivate: [AuthGuard],
    data: { requiredPrivilege: ['ADMIN', 'FEEDBACK_TRACKER', 'TEAM_LEAD'] },
  },
  {
    path:'FeedBackPage',
    component:FeedbackTrackerComponent,
    canActivate: [AuthGuard],
    data: { requiredPrivilege: ['ADMIN', 'FEEDBACK_TRACKER', 'TEAM_LEAD'] },
  },
  {
    path: 'welcome-calls-dashboard',
    component: CallLogsDashboardComponent,
    canActivate: [AuthGuard],
    data: { requiredPrivilege: ['ADMIN', 'FEEDBACK_TRACKER', 'TEAM_LEAD'] },
  },
  {
    path: 'welcome-calls',
    component: CallLogsComponent,
    canActivate: [AuthGuard],
    data: { requiredPrivilege: ['ADMIN', 'FEEDBACK_TRACKER', 'TEAM_LEAD'] },
  },
  {
    path: 'welcome-calls-tracker',
    component: CallLogsTrackerComponent,
    canActivate: [AuthGuard],
    data: { requiredPrivilege: ['ADMIN', 'FEEDBACK_TRACKER', 'TEAM_LEAD'] },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
