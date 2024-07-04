import { Component, OnInit  } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FeedbackService } from './services/feedback-service/feedback.service';
import { ToastNotificationsService } from './services/toast-notification-service/toast-notifications.service';
import { InternalService } from './services/internal-service/internal.service';
import { DOMAINS_LIST } from './enum/domains.config';


interface User{
  id:number,
  name:string,
  email:string,
  role_id:number[],
  roles:string[],
  page_names:string[],
  page_links:string[],
  page_ids:number[],
  page_icons:string[],
  page_details:{id:number, position:number, name:string, link:string, icon:string, parentId:number, children:any[]}[],
  role_value:string[],
  isAuthenticated:boolean,

};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{
  title = 'wellbefore';

  authenticationDetails:User = { id: 0, name: '', email: '',  role_id: [], roles: [], role_value: [], page_names:[], page_links:[], page_icons:[], page_ids:[], page_details:[], isAuthenticated: false};
  onlyReturnsTrackerAccess:boolean=false;

  user$!: Observable<any>;
  sessionKey:string = 'AUTHENTICATE';
  processedHierarchy:any;

  constructor(
    private router : Router,
    private feedbackService: FeedbackService,
    public toastService: ToastNotificationsService,
    public internalService:InternalService,
    private fireAuth : AngularFireAuth,
  ) {
    this.user$ = this.checkUser();

  }

  signInWithGoogle() {
    return this.fireAuth.signInWithPopup(new GoogleAuthProvider).then((res) => {
      const user = res.user || null;
      const mail = res.user?.email ? res.user?.email : '';
      const valid = DOMAINS_LIST.includes(mail.split('@')[1]);
      if (valid) {
        const userData = {"email":mail, "name":user?.displayName};
        this.feedbackService.getUserAuthtication(userData).subscribe((data:any) =>{
          //const pageDetails = this.sortPagesBasedOnPositions(data[0]);
          if(data && data.length != 0){
            this.authenticationDetails = {
              id: data[0].id,
              name: data[0].name,
              email: data[0].email,
              role_id: data[0].role_id,
              roles: data[0].role,
              role_value: data[0].role_value,
              page_names:[], page_links:[], page_icons:[], page_ids:[],
              page_details:this.processPagesIntoHierarchy(data[0]),
              isAuthenticated: (data[0].active === "True")
            };
            localStorage.setItem('authDetails', JSON.stringify(this.authenticationDetails));
            localStorage.setItem(`${this.sessionKey}_timestamp`, String(Date.now()));
            if(this.authenticationDetails.role_value.includes('RETURNS')){
              this.router.navigate(['returns']);
            }else{
              this.router.navigate(['order-issues-tracker']);
            }
            this.user$ = this.checkUser();
          }else{
            this.toastService.showError('Un Authorized User!', 'Sorry! User Does Not Exist.');
            this.fireAuth.signOut();
          }

        });

      } else {
        this.toastService.showError('Un Authorized User!', 'Sorry! User Does Not Exist.');
        localStorage.removeItem('authDetails');
        localStorage.removeItem(`${this.sessionKey}_timestamp`);
        this.fireAuth.signOut();
      }
    });
  }

  checkUser(): Observable<any> {
    const cachedTimestamp = localStorage.getItem(`${this.sessionKey}_timestamp`) || '0';
    const authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');
    const cacheExpirationTime = 24 * 60 * 60 * 1000; // 24 Hours Session setting
    if (authUser !== null && cachedTimestamp && Date.now() - Number(cachedTimestamp) < cacheExpirationTime) {
      this.authenticationDetails = authUser;
      return of(authUser);
    } else {
      localStorage.removeItem('authDetails');
      localStorage.removeItem(`${this.sessionKey}_timestamp`);
      if(this.fireAuth.authState){
        this.fireAuth.signOut();
      }
      return of(false);
    }
  }

  signOutUser(){
    this.fireAuth.signOut();
    localStorage.removeItem('authDetails');
    localStorage.removeItem(`${this.sessionKey}_timestamp`);
    this.user$ = this.checkUser();
    this.router.navigateByUrl('');
  }

  sortPagesBasedOnPositions(data:any){
    let combined = data.page_positions.map((position:any, index:number) => ({
      position,
      name: data.page_names[index],
      link: data.page_links[index],
      icon: data.page_icons[index],
      id: data.page_ids[index]
    }));
    combined.sort((a:any, b:any) => a.position - b.position);
    return {
      page_positions : combined.map((item:any) => item.position),
      page_names : combined.map((item:any) => item.name),
      page_links : combined.map((item:any) => item.link),
      page_ids : combined.map((item:any) => item.id),
      page_icons: combined.map((item:any) => item.icon)
    };
  }

  processPagesIntoHierarchy(data: any) {
    // First, combine the page details into a single array of objects
    let combined = data.page_positions.map((position:any, index:number)=> ({
        position,
        name: data.page_names[index],
        link: data.page_links[index],
        icon: data.page_icons[index],
        id: data.page_ids[index],
        parentId: data.page_parent_ids[index]
    }));

    // Sort by position
    combined.sort((a:any, b:any) => a.position - b.position);

    // Function to recursively find and assign children
    const findAndAssignChildren = (parent:any) => {
        return combined.filter((page:any) => page.parentId === parent.id).map((page:any) => ({
            ...page,
            children: findAndAssignChildren(page)
        }));
    };

    // Build the hierarchy starting with root pages (pages with parentId 0)
    let hierarchy = combined
        .filter((page:any) => page.parentId === 0)
        .map((page:any) => ({
            ...page,
            children: findAndAssignChildren(page)
        }));

    return hierarchy;
  }


}
