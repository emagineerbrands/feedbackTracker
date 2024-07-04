import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bread-crumbs',
  templateUrl: './bread-crumbs.component.html',
  styleUrl: './bread-crumbs.component.css'
})
export class BreadCrumbsComponent implements OnInit{
  @Input() Title = '';
  @Input() list:any[] = [];

  constructor(
    private router: Router,
  ) {}

  ngOnInit(){
  }

  pagenavigation(page:string){
    this.router.navigate([page]);
  }
}
