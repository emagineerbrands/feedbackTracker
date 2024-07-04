import { Component } from '@angular/core';
import { faEnvelope, faColumns, faImage, faCalendarAlt, faTable, faEdit, faTree, faChartPie, faCopy, faSearch, faTachometerAlt, faTh } from '@fortawesome/free-solid-svg-icons';
import { WholeServiceService } from 'src/app/services/whole-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  nav = true
  loading = true;
  

  faEnvelope = faEnvelope;
  faColumns = faColumns;
  faImage = faImage;
  faCalendarAlt = faCalendarAlt;
  faTable = faTable;
  faEdit = faEdit
  faTree = faTree
  faChartPie = faChartPie
  faCopy = faCopy
  isVisable =false
  faSearch = faSearch;
  faTachometerAlt = faTachometerAlt;
  faTh = faTh;
  toggle(){
    this.isVisable = !this.isVisable
    // const elm = document.getElementById('wrapper')
  };
  constructor(private service: WholeServiceService) { }

  ngOnInit(): void {
    this.nav = this.service.sideNav
  }

  ngOnChanges(){
    this.nav = this.service.sideNav
  }

  onc(){
    this.nav = this.service.sideNav
  }

}
