import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarouselConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAddComponent } from '../model-popup/user-add/user-add.component';

import { DatePipe } from '@angular/common';
import { UserRemoveComponent } from '../model-popup/user-remove/user-remove.component';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { UsersRolesListTableCellRenderComponent } from '../particals/users-ag-grid-particals/users-roles-list-table-cell-render/users-roles-list-table-cell-render.component';
import { UsersStatusHtmlTableRenderComponent } from '../particals/users-ag-grid-particals/users-status-html-table-render/users-status-html-table-render.component';
import { UserActionsHtmlTableRenderComponent } from '../particals/users-ag-grid-particals/user-actions-html-table-render/user-actions-html-table-render.component';
import { FeedbackService } from '../../services/feedback-service/feedback.service';
import { DateConvertService } from '../../services/date-convert-service/date-convert.service';
import { Numbers } from '../../enum/Numbers.enum';
import { UserStatus } from '../../enum/user-status.enum';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{

  private gridApi!: GridApi;
  public gridOptions!: GridOptions;
  pageTitle:string = 'Users';
  breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': this.pageTitle, 'link': 'users', 'status':'active'},

  ];

  usersList:any[]=[];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  startingRowNumber: number = 1;
  userDetails:any;
  usersRole:any;


  // Enable pagination
  pagination: boolean = true;
  paginationPageSize: number = 10; // Number of rows per page



  rowData:any[] = [];

  public gridColumnApi: any;
  constructor(
    private router: Router,
    private feedbackService: FeedbackService,
    private modalService: NgbModal,
    private datePipe: DateConvertService,
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('authDetails') || 'null');
    this.gridOptions = this.initializeGridOptions();
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
      { headerName: '#', valueGetter: (params) => params.data.srNum, width:Numbers.HUNDRED },
      { headerName: 'Name', valueGetter: (params) => params.data.name },
      { headerName: 'Email', valueGetter: (params) => params.data.email },
      { headerName: 'Role', valueGetter: (params) => params.data.roles, cellRenderer: UsersRolesListTableCellRenderComponent, cellRendererParams: { color: 'guinnessBlack' } },
      { headerName: 'Created By', valueGetter: (params) => params.data.created_by },
      { headerName: 'Created Date', valueGetter: (params) => params.data.created_date },
      { headerName: 'Modified By', valueGetter: (params) => params.data.modified_by },
      { headerName: 'Modified Date', valueGetter: (params) => params.data.modified_date },
      { headerName: 'Status', cellRenderer: UsersStatusHtmlTableRenderComponent, valueGetter: (params) => params.data.modified_date, cellRendererParams: { color: 'guinnessBlack' } },
      { headerName: 'Actions', cellRenderer: UserActionsHtmlTableRenderComponent, valueGetter: (params) => params, cellRendererParams: { color: 'guinnessBlack' } }
    ];
  }

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.showLoadingOverlay();
  }

  ngOnInit(): void {
    this.getALlUsers();
    this.getALlUsersRole();
  }

  navigateHomePgae(){
    const authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');
    if(authUser.role_id.includes(4)){
      this.router.navigate(['/returns']);
    }else{
      this.router.navigate(['/order-issues-tracker']);
    }
  }

  async getALlUsers(){

    await this.feedbackService.allUsersList().subscribe({
      next: (data:any) => this.processData(data),
      error: (error:any) => {
        this.gridApi.showNoRowsOverlay();
      }
    });
  }

  processData(data:any){
    this.gridApi.showNoRowsOverlay();
    data.map((d:any, index:number) => {
      d.srNum = index+1;
      d.created_date = this.datePipe.transform(d.created_date, 'shortDate');
      d.modified_date = this.datePipe.transform(d.modified_date, 'shortDate');
    });
    this.usersList = data;
    this.rowData=data;
  }

  async getALlUsersRole(){
    await this.feedbackService.allUsersRole().subscribe((data:any) =>{
      this.usersRole = data;

    });
  }


  openModelForUserAdding(){
    const modalRefApprove = this.modalService.open(UserAddComponent);
    (<UserAddComponent>modalRefApprove.componentInstance).userDetails = { userId:0, email:"", role:0 };
    (<UserAddComponent>modalRefApprove.componentInstance).usersRole = this.usersRole;
    modalRefApprove.componentInstance.UserData.subscribe((data:any) => {

      this.getALlUsers();
    });
  }

  updateUser(user:any, index:number){
    const modalRefApprove = this.modalService.open(UserAddComponent);
    (<UserAddComponent>modalRefApprove.componentInstance).userDetails = { userId:user.id, email:user.email, role:user.role_id };
    (<UserAddComponent>modalRefApprove.componentInstance).usersRole = this.usersRole;
    modalRefApprove.componentInstance.UserData.subscribe((data:any) => {
      this.usersList[index].roles = data.usersRole;
      this.usersList[index].role_id = data.userdata.role_id;
    });

  }

  async userInactive(user:any, index:number, status:any, event:any){
    const modalRefApprove = this.modalService.open(UserRemoveComponent);
    const data = {
      id:user.id,
      // Use the enum to determine the user status
      user_status: status === UserStatus.Deleted ? UserStatus.Deleted : (status === UserStatus.Active ? UserStatus.Inactive : UserStatus.Active),
      Modified_by:this.userDetails.id
    };
    // Use the enum to construct the confirmation text
    const text = status === UserStatus.Deleted ? "Delete " : (status === UserStatus.Active ? "Inactive " : "Activate ");

    const userInfoString = 'Are You sure To '+ text + user.email;
    (<UserRemoveComponent>modalRefApprove.componentInstance).userDetailsString = userInfoString;
    (<UserRemoveComponent>modalRefApprove.componentInstance).userDetails = data;
    (<UserRemoveComponent>modalRefApprove.componentInstance).userEmail = user.email;
    modalRefApprove.componentInstance.UserData.subscribe((data:any) => {
      this.usersList[index].user_status = data.userdata.user_status;
      if(data.userdata.user_status == UserStatus.Deleted){
        this.usersList.splice(index, 1);

        // Efficiently update the grid's row data
        const transaction = {
          remove: [user]
        };
        this.gridApi.applyTransaction(transaction);
      }
    });
    modalRefApprove.componentInstance.noChange.subscribe((data:any) => {
      event.target.checked = !event.target.checked;
    });
  }

}
