import { Component, PLATFORM_ID, Inject, OnInit  } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FeedbackService } from './services/feedback-service/feedback.service';
import { ToastNotificationsService } from './services/toast-notification-service/toast-notifications.service';
import { User } from './interface/User';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'feedbackTracker';
  domainsList = ["wellbefore.com", "sails.solutions", "emagineer.com", "performanceagency.com", "emagineerbrands.com"];
  authenticationDetails:User = { id: 0, name: '', email: '',  role_id: [], roles: [], role_value: [], page_names:[], page_links:[], page_icons:[], page_ids:[], isAuthenticated: false};
  onlyReturnsTrackerAccess:boolean=false;

  user$!: Observable<any>;
  sessionKey:string = 'AUTHENTICATE';

  constructor(
    private fireAuth : AngularFireAuth,
    private router : Router,
    private service: FeedbackService,
    public toastService: ToastNotificationsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // Code that uses localStorage
      this.user$ = this.checkUser();
    }

    //this.signOutUser();
    //alert();

  }

  signInWithGoogle() {
    return this.fireAuth.signInWithPopup(new GoogleAuthProvider).then((res) => {
      const user = res.user || null;
      const mail = res.user?.email ? res.user?.email : '';
      const valid = this.domainsList.includes(mail.split('@')[1]);
      if (valid) {
        const userData = {"email":mail, "name":user?.displayName};
        this.service.getUserAuthtication(userData).subscribe((data:any) =>{
          const dashboardIndex = data[0].page_names.indexOf("Dashboard");

          // If "Dashboard" is found and is not already at the beginning
          if (dashboardIndex !== -1 && dashboardIndex !== 0) {
            // Move the elements at the found index to the beginning
            data[0].page_names.unshift(data[0].page_names.splice(dashboardIndex, 1)[0]);
            data[0].page_links.unshift(data[0].page_links.splice(dashboardIndex, 1)[0]);
            data[0].page_icons.unshift(data[0].page_icons.splice(dashboardIndex, 1)[0]);
          }
          if(data.length != 0){
            this.authenticationDetails = {
              id: data[0].id,
              name: data[0].name,
              email: data[0].email,
              role_id: data[0].role_id,
              roles: data[0].role,
              role_value: data[0].role_value,
              page_names: data[0].page_names,
              page_links: data[0].page_links,
              page_icons: data[0].page_icons,
              page_ids: data[0].page_ids,
              isAuthenticated: (data[0].active === "True")
            };


            localStorage.setItem('authDetails', JSON.stringify(this.authenticationDetails));
            localStorage.setItem(`${this.sessionKey}_timestamp`, String(Date.now()));
           // this.router.navigateByUrl('');
            if(this.authenticationDetails.role_value.includes('RETURNS')){
              this.router.navigate(['returns']);
            }else{
              this.router.navigate(['feedback_tracker']);
            }
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
    return timer(0, 1000).pipe(
      switchMap(() => {
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
      })
    );
  }

  signOutUser(){
    this.fireAuth.signOut().then(()=>{
      localStorage.removeItem('authDetails');
      localStorage.removeItem(`${this.sessionKey}_timestamp`);
      this.router.navigateByUrl('');
    });
  }

  redirectPage(page:string){
    //alert();
    this.router.navigateByUrl(page);
  }
}
