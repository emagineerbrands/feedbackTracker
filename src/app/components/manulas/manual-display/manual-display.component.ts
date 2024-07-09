import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { ManualService } from '../../../services/manual-service/manual.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-manual-display',
  templateUrl: './manual-display.component.html',
  styleUrl: './manual-display.component.css'
})
export class ManualDisplayComponent implements OnInit{

  pageTitle:string = 'Manual Preview';
  breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': 'User Manauls', 'link': 'user-manual', 'status':'inactive'},
    {'title': this.pageTitle, 'link': '', 'status':'active'},
  ];
  isLoading:boolean = true;

  viewType:string = '/edit';
  googleDocBaseURL: string = environment.GoogleDocBaseURL;
  googleDocId: string = "";


  constructor(
    private manualService: ManualService,
    private activatedRoute: ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe(params => {
      const manualId = Number(params['manualId']);
      this.getManul(manualId);
    });
  }


  getManul(manualId:number):void{
    this.manualService.getManual(manualId).subscribe({
      next:(data:any)=>{
        this.googleDocId = data[0].FileId;
      },
      error:(error:any)=>{
        console.log(error);
      }
    });
  }

  onDocLoad() {
    this.isLoading = false;
  }


}
