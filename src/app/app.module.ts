import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductGroupingTableComponent } from './components/particals/product-grouping-table/product-grouping-table.component';
import { FeedbackService } from './services/feedback-service/feedback.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ShortDatePipe } from './customPipes/short-date.pipe';
import { DatePipe } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { UsersComponent } from './components/users/users.component';
import { UserAddComponent } from './components/model-popup/user-add/user-add.component';
import { RemoveTicketConfirmComponent } from './components/model-popup/remove-ticket-confirm/remove-ticket-confirm.component';
import { ReturnsTrackerListComponent } from './components/returnsTracker/returns-tracker-list/returns-tracker-list.component';
import { ReturnsOrderSearchComponent } from './components/returnsTracker/returns-order-search/returns-order-search.component';
import { WebcamModule } from 'ngx-webcam';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NgxPaginationModule } from 'ngx-pagination';
import { BaseChartDirective  } from 'ng2-charts';
import { UserRemoveComponent } from './components/model-popup/user-remove/user-remove.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { BreadCrumbsComponent } from './components/particals/bread-crumbs/bread-crumbs.component';
import { SmallBoxComponent } from './components/particals/small-box/small-box.component';
import { CardChartHeaderComponent } from './components/particals/card-chart-header/card-chart-header.component';
import { ChartTableComponent } from './components/particals/chart-table/chart-table.component';
import { BasicTableComponent } from './components/particals/basic-table/basic-table.component';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { FeedbackFiltersComponent } from './components/particals/feedback-filters/feedback-filters.component';
import { DateRangePickerComponent } from './components/particals/date-range-picker/date-range-picker.component';
import { PaginationComponent } from './components/particals/pagination/pagination.component';
import { CallLogsTrackerComponent } from './components/wellcome-call-logs/call-logs-tracker/call-logs-tracker.component';
import { CallLogsComponent } from './components/wellcome-call-logs/call-logs/call-logs.component';
import { ShopifyOrderSearchComponent } from './components/feedback/shopify-order-search/shopify-order-search.component';
import { ShopifyOrderSearchFiltersComponent } from './components/particals/shopify-order-search-filters/shopify-order-search-filters.component';
import { InternalService } from './services/internal-service/internal.service';
import { FeedbackTrackerComponent } from './components/feedback/feedback-tracker/feedback-tracker.component';
import { RestrictCharactersDirective } from './directives/restrict-characters/restrict-characters.directive';
import { AgGridModule } from 'ag-grid-angular';
import { UsersRolesListTableCellRenderComponent } from './components/particals/users-ag-grid-particals/users-roles-list-table-cell-render/users-roles-list-table-cell-render.component';
import { CallLogsActionViewHtmlRenderComponent } from './components/particals/call-logs-ag-grid-particals/call-logs-action-view-html-render/call-logs-action-view-html-render.component';
import { UsersStatusHtmlTableRenderComponent } from './components/particals/users-ag-grid-particals/users-status-html-table-render/users-status-html-table-render.component';
import { CallLogsCustomDateFilterComponent } from './components/particals/call-logs-ag-grid-particals/call-logs-custom-date-filter/call-logs-custom-date-filter.component';
import { ShippingTrackerComponent } from './components/returnsTracker/shipping-tracker/shipping-tracker.component';
import { ImagesRemoveCheckComponent } from './components/model-popup/images-remove-check/images-remove-check.component';
import { SelectTagCompComponent } from './components/small-particals/select-tag-comp/select-tag-comp.component';
import { CallLogsSelectFilterComponent } from './components/particals/call-logs-ag-grid-particals/call-logs-select-filter/call-logs-select-filter.component';
import { DownloadOptionComponent } from './components/small-particals/download-option/download-option.component';
import { CallLogsDashboardComponent } from './components/wellcome-call-logs/call-logs-dashboard/call-logs-dashboard.component';
import { AnchorTagCompComponent } from './components/small-particals/anchor-tag-comp/anchor-tag-comp.component';
import { CallLogsAnchorTagViewHtmlRenderComponent } from './components/particals/call-logs-ag-grid-particals/call-logs-anchor-tag-view-html-render/call-logs-anchor-tag-view-html-render.component';
import { UserActionsHtmlTableRenderComponent } from './components/particals/users-ag-grid-particals/user-actions-html-table-render/user-actions-html-table-render.component';
import { SkuAutoCompleteComponent } from './components/particals/sku-auto-complete/sku-auto-complete.component';


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
    ProductGroupingTableComponent,
    ShortDatePipe,
    UsersComponent,
    UserAddComponent,
    RemoveTicketConfirmComponent,
    ImagesRemoveCheckComponent,
    ReturnsTrackerListComponent,
    ReturnsOrderSearchComponent,
    UserRemoveComponent,
    HomePageComponent,
    BreadCrumbsComponent,
    SmallBoxComponent,
    CardChartHeaderComponent,
    ChartTableComponent,
    BasicTableComponent,
    FeedbackListComponent,
    FeedbackFiltersComponent,
    DateRangePickerComponent,
    PaginationComponent,
    CallLogsTrackerComponent,
    CallLogsComponent,
    ShopifyOrderSearchComponent,
    ShopifyOrderSearchFiltersComponent,
    FeedbackTrackerComponent,
    UsersRolesListTableCellRenderComponent,
    CallLogsActionViewHtmlRenderComponent,
    UsersStatusHtmlTableRenderComponent,
    UserActionsHtmlTableRenderComponent,
    CallLogsCustomDateFilterComponent,
    ShippingTrackerComponent,
    ShortDatePipe,
    SelectTagCompComponent,
    CallLogsSelectFilterComponent,
    DownloadOptionComponent,
    CallLogsDashboardComponent,
    AnchorTagCompComponent,
    CallLogsAnchorTagViewHtmlRenderComponent,
    AppComponent,
    SkuAutoCompleteComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    WebcamModule,
    BaseChartDirective,
    RestrictCharactersDirective,
    AgGridModule,
    AngularFireModule.initializeApp(firebaseConfigJson),
    AngularFireAuthModule,
  ],
  providers: [
    FeedbackService,
    DatePipe,
    NgxImageCompressService,
    { provide: BaseChartDirective, useValue: { generateColors: false }},
    InternalService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [InternalService, FeedbackService],
      multi: true,
    },
    //provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
