import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { NgChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { BreadCrumbsComponent } from './components/particals/bread-crumbs/bread-crumbs.component';
import { SmallBoxComponent } from './components/particals/small-box/small-box.component';
import { ChartTableComponent } from './components/particals/chart-table/chart-table.component';
import { FeedbackFiltersComponent } from './components/particals/feedback-filters/feedback-filters.component';
import { DateRangePickerComponent } from './components/particals/date-range-picker/date-range-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { PaginationComponent } from './components/particals/pagination/pagination.component';
import { ConfirmationCheckComponent } from './components/model-popup/confirmation-check/confirmation-check.component';
import { BasicTableComponent } from './components/particals/basic-table/basic-table.component';
import { CardChartHeaderComponent } from './components/particals/card-chart-header/card-chart-header.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    FeedbackListComponent,
    BreadCrumbsComponent,
    SmallBoxComponent,
    ChartTableComponent,
    FeedbackFiltersComponent,
    DateRangePickerComponent,
    PaginationComponent,
    ConfirmationCheckComponent,
    BasicTableComponent,
    CardChartHeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    HttpClientModule,
    NgChartsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    NgbModule,
  ],
  providers: [
    DatePipe,
    provideClientHydration(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
