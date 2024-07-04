import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { faBell, faGear, faHome, faNoteSticky, faUser, faUsers, faSearch, faComment, faTimes, faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']

})
export class SidenavComponent implements OnInit {
  @Output() buttonclick = new EventEmitter<boolean>;
  booleanValue = false;
  searchBar = false;
  notification = false;
  profile = false;
  messages = false;

  faBell = faBell;
  faComment = faComment;
  faTimes = faTimes;
  faBars = faBars;
  faSearch = faSearch;
  toggle(){
    this.booleanValue = !this.booleanValue
    this.buttonclick.emit(this.booleanValue)
   }

  ngOnInit(): void {
  }

}
