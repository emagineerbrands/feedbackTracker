import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { HomePageComponent } from './components/home-page/home-page.component';
import { SmallBoxComponent } from './components/particals/small-box/small-box.component';
import { CardChartHeaderComponent } from './components/particals/card-chart-header/card-chart-header.component';
import { ChartTableComponent } from './components/particals/chart-table/chart-table.component';
import { BasicTableComponent } from './components/particals/basic-table/basic-table.component';
import { BaseChartDirective } from 'ng2-charts';
import { CallLogsComponent } from './components/wellcome-call-logs/call-logs/call-logs.component';
import { AgGridModule } from 'ag-grid-angular';
import { CallLogsDashboardComponent } from './components/wellcome-call-logs/call-logs-dashboard/call-logs-dashboard.component';
import { SelectTagCompComponent } from './components/small-particals/select-tag-comp/select-tag-comp.component';
import { CallLogsSelectFilterComponent } from './components/particals/call-logs-ag-grid-particals/call-logs-select-filter/call-logs-select-filter.component';
import { CallLogsAnchorTagViewHtmlRenderComponent } from './components/particals/call-logs-ag-grid-particals/call-logs-anchor-tag-view-html-render/call-logs-anchor-tag-view-html-render.component';
import { CallLogsCustomDateFilterComponent } from './components/particals/call-logs-ag-grid-particals/call-logs-custom-date-filter/call-logs-custom-date-filter.component';
import { AnchorTagCompComponent } from './components/small-particals/anchor-tag-comp/anchor-tag-comp.component';
import { CallLogsTrackerComponent } from './components/wellcome-call-logs/call-logs-tracker/call-logs-tracker.component';
import { ReturnsOrderSearchComponent } from './components/returnsTracker/returns-order-search/returns-order-search.component';
import { ReturnsTrackerListComponent } from './components/returnsTracker/returns-tracker-list/returns-tracker-list.component';
import { ShippingTrackerComponent } from './components/returnsTracker/shipping-tracker/shipping-tracker.component';
import { RemoveTicketConfirmComponent } from './components/model-popup/remove-ticket-confirm/remove-ticket-confirm.component';
import { WebcamModule } from 'ngx-webcam';
import { UsersComponent } from './components/users/users.component';
import { UserAddComponent } from './components/model-popup/user-add/user-add.component';
import { AnchorTagViewHtmlRenderComponent } from './components/particals/manuals/anchor-tag-view-html-render-component/anchor-tag-view-html-render-component.component';
import { ActionViewHtmlRenderComponent } from './components/particals/manuals/action-view-html-render/action-view-html-render.component';
import { IconTagCompComponent } from './components/small-particals/icon-tag-comp/icon-tag-comp.component';
import { AddManualComponent } from './components/model-popup/add-manual/add-manual.component';
import { ManualListComponent } from './components/manulas/manual-list/manual-list.component';
import { LoaderComponent } from './components/particals/loader/loader.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ManualDisplayComponent } from './components/manulas/manual-display/manual-display.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { UsersStatusHtmlTableRenderComponent } from './components/particals/users-ag-grid-particals/users-status-html-table-render/users-status-html-table-render.component';
import { ExpandCellRendererComponent, FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { UsersRolesListTableCellRenderComponent } from './components/particals/users-ag-grid-particals/users-roles-list-table-cell-render/users-roles-list-table-cell-render.component';
import { ExpandableRowRendererComponent } from './components/particals/order-issue-ag-grid-particals/expandable-row-renderer/expandable-row-renderer.component';

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
    HomePageComponent,
    SmallBoxComponent,
    CardChartHeaderComponent,
    ChartTableComponent,
    BasicTableComponent,
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
    ShortDatePipe,
    CallLogsComponent,
    CallLogsDashboardComponent,
    SelectTagCompComponent,
    CallLogsSelectFilterComponent,
    CallLogsAnchorTagViewHtmlRenderComponent,
    CallLogsCustomDateFilterComponent,
    AnchorTagCompComponent,
    CallLogsTrackerComponent,
    ReturnsOrderSearchComponent,
    ReturnsTrackerListComponent,
    ShippingTrackerComponent,
    RemoveTicketConfirmComponent,
    UsersComponent,
    UserAddComponent,
    AnchorTagViewHtmlRenderComponent,
    ActionViewHtmlRenderComponent,
    IconTagCompComponent,
    AddManualComponent,
    ManualListComponent,
    LoaderComponent,
    ManualDisplayComponent,
    UsersStatusHtmlTableRenderComponent,
    UsersRolesListTableCellRenderComponent,
    ExpandCellRendererComponent,
    ExpandableRowRendererComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    AppRoutingModule,
    BaseChartDirective,
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfigJson),
    AngularFireAuthModule,
    AgGridModule.withComponents([ExpandableRowRendererComponent]),
    WebcamModule,
    NgxDocViewerModule
  ],
  providers: [
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
    provideClientHydration(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
