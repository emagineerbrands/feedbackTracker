import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedbackTrackerComponent } from './components/feedback/feedback-tracker/feedback-tracker.component';
import { ShopifyOrderSearchComponent } from './components/feedback/shopify-order-search/shopify-order-search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationCheckComponent } from './components/model-popup/confirmation-check/confirmation-check.component';
import { ImagesRemoveCheckComponent } from './components/model-popup/images-remove-check/images-remove-check.component';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { FeedbackFiltersComponent } from './components/particals/feedback-filters/feedback-filters.component';
import { DateRangePickerComponent } from './components/particals/date-range-picker/date-range-picker.component';
import { PaginationComponent } from './components/particals/pagination/pagination.component';
import { BreadCrumbsComponent } from './components/particals/bread-crumbs/bread-crumbs.component';
import { DownloadOptionComponent } from './components/small-particals/download-option/download-option.component';
import { SkuAutoCompleteComponent } from './components/particals/sku-auto-complete/sku-auto-complete.component';
import { ShopifyOrderSearchFiltersComponent } from './components/particals/shopify-order-search-filters/shopify-order-search-filters.component';
import { ProductGroupingTableComponent } from './components/particals/product-grouping-table/product-grouping-table.component';
import { ShortDatePipe } from './customPipes/short-date.pipe';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { InternalService } from './services/internal-service/internal.service';
import { FeedbackService } from './services/feedback-service/feedback.service';

export function initializeApp(myService: InternalService, feedbackService: FeedbackService ) {
  return () => {
      myService.loadFirebaseAuthenticationConfig();
      myService.loadStaticData();
      myService.loadSKUDetails();
      myService.allUsers();

    };
}

const firebaseConfigString = localStorage.getItem('firebaseConfig');
let firebaseConfigJson:any = {};
if (firebaseConfigString) {
  const parsedJsonData = JSON.parse(atob(firebaseConfigString));
  firebaseConfigJson = parsedJsonData;
} else {
  console.error('Firebase config not found in local storage.');
}

@NgModule({
  declarations: [
    AppComponent,
    FeedbackListComponent,
    FeedbackTrackerComponent,
    FeedbackFiltersComponent,
    ShopifyOrderSearchComponent,
    DateRangePickerComponent,
    PaginationComponent,
    ImagesRemoveCheckComponent,
    ConfirmationCheckComponent,
    DownloadOptionComponent,
    BreadCrumbsComponent,
    SkuAutoCompleteComponent,
    ShopifyOrderSearchFiltersComponent,
    ProductGroupingTableComponent,
    ShortDatePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfigJson),
    AngularFireAuthModule,
  ],
  providers: [
    DatePipe,
    provideClientHydration(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
