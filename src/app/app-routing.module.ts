import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { HomePageComponent } from './components/home-page/home-page.component';


const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'feedback_tracker',
    component: FeedbackListComponent,
    data: { requiredPrivilege: ['ADMIN', 'FEEDBACK_TRACKER', 'TEAM_LEAD'] },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
