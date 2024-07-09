import { AfterViewInit, Component, ElementRef, ViewChild, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarouselConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddManualComponent } from '../../model-popup/add-manual/add-manual.component';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { AnchorTagViewHtmlRenderComponent } from '../../particals/manuals/anchor-tag-view-html-render-component/anchor-tag-view-html-render-component.component';
import { ActionViewHtmlRenderComponent } from '../../particals/manuals/action-view-html-render/action-view-html-render.component';
import { ConfirmationCheckComponent } from '../../model-popup/confirmation-check/confirmation-check.component';
import { ManualService } from '../../../services/manual-service/manual.service';
import { InternalService } from '../../../services/internal-service/internal.service';
import { ToastNotificationsService } from '../../../services/toast-notification-service/toast-notifications.service';
import { environment } from '../../../../environments/environment';
import { Numbers } from '../../../enum/Numbers.enum';

@Component({
  selector: 'app-manual-list',
  templateUrl: './manual-list.component.html',
  styleUrl: './manual-list.component.css'
})
export class ManualListComponent implements OnInit, AfterViewInit {

  private gridApi!: GridApi;
  public gridOptions!: GridOptions;
  public gridColumnApi: any;
  rowData:any[] = [];
  isLoading:boolean = true;
  dataExist:boolean = false;

  pageTitle:string = 'User Manuals';
  breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': this.pageTitle, 'link': 'user-manual', 'status':'active'},
  ];

  @ViewChild('iframeContainer', { static: false }) iframeContainer!: ElementRef;

  documentHtml: string = '';
  headings: Array<{ title: string, id: string }> = [];
  names: string[] = [
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Michael Brown',
    'Emily Davis',
    'Daniel Wilson',
    'Jessica Garcia',
    'David Martinez',
    'Sophia Hernandez',
    'James Lopez'
  ];

  googleDocBaseURL: string = environment.GoogleDocBaseURL;
  googleDocId: string = "";
  viewType: string = "/preview";

  async ngOnInit() {
    this.getManuals();
  }

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private manualService: ManualService,
    private internalService:InternalService,
    public toastNotificationsService: ToastNotificationsService,
  ) {
    this.gridOptions = this.initializeGridOptions();
    this.getManuals();

  }

  initializeGridOptions(): GridOptions {
    return {
      pagination: true,
      paginationPageSize: 10,
      domLayout: 'autoHeight',
      paginationPageSizeSelector: [10, 20, 50, 100],
      columnDefs: this.getColumnDefs(),
      context: {
        componentParent: this
      },
      overlayLoadingTemplate: `<span class="ag-overlay-loading-center">Loading...</span>`,
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true
      }
    };
  }

  getColumnDefs(): ColDef[] {
    return [
      { headerName: 'Document Name', cellRenderer:AnchorTagViewHtmlRenderComponent, valueGetter:params => params.data.FileName, sortable: true, filter:true},
      { headerName: 'Action', cellRenderer:ActionViewHtmlRenderComponent, width:Numbers.SIXTY, sortable: false, filter:false },
    ];
  }

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.showLoadingOverlay();
  }

  getManuals(){
    this.manualService.getAllManuals().subscribe({
      next: (data:any) => this.processData(data),
      error: (error:any) => {
        this.gridApi.showNoRowsOverlay();
      }
    });
  }

  ngAfterViewInit() {
    this.detectIframeLoad();
  }

  detectIframeLoad() {
    setTimeout(() => {
      const iframe = this.iframeContainer?.nativeElement?.querySelector('iframe');
      if (iframe) {
        iframe.onload = () => {
          this.isLoading = false;
        };
      }
    }, 0);
  }

  processData(data: any[]) {
    this.gridApi.showNoRowsOverlay();
    this.dataExist = data.length > 0;
    const item = data[0];
    if (item) {
      this.googleDocId = item.FileId;
    }
    this.rowData = data;
    this.isLoading = !!this.googleDocId;
    if (this.googleDocId) {
      this.detectIframeLoad();
    }
  }

  previewDoc(id:number, fileId:string){
    this.isLoading = true;
    this.googleDocId = fileId;
  }

  onDocLoad() {
    this.isLoading = false;
  }


  deleteManual(doc:any){
    const payload = {
      file_id: doc.FileId,
      Modified_by: this.internalService.logedInUser()?.id,
      is_active: false,
    }
    const modalRefApprove = this.modalService.open(ConfirmationCheckComponent,{
      backdropClass: 'custom-backdrop'
    });
    const context:string = "Are you Sure! You want to Delete "+doc.FileName+" Document!";
    (<ConfirmationCheckComponent>modalRefApprove.componentInstance).data = context;
    modalRefApprove.componentInstance.OutputData.subscribe((data:any) => {
      this.manualService.deleteManual(payload).subscribe({
        next:(data:any)=>{
          this.getManuals();
          this.toastNotificationsService.showSuccess('Success!', 'User Manual Succesfully Deleted.');
        },
        error:(error:any)=>{
          console.log(error)
        }
      });
      // Efficiently update the grid's row data
      const transaction = {
        remove: [doc]
      };
      this.gridApi.applyTransaction(transaction);
    });

  }


  redirectToPreviewManual(id:number, fileId: string) {
    const payload = {
      FileId: fileId,
      Email: this.internalService.logedInUser()?.email,
    }
    this.manualService.updateManualPermission(payload).subscribe({
      next:(data:any)=>{
        this.router.navigate(['/preview-manual'], { queryParams: {'manualId': id } });
      },
      error:(error:any)=>{
        console.log(error)
      }
    });

  }

  triggerFileInput() {
    const modalRefApprove = this.modalService.open(AddManualComponent);
    modalRefApprove.componentInstance.ManualDoc.subscribe(() => {
      this.getManuals();
    });
  }

}
