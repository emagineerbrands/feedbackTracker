import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { InternalService } from './services/internal-service/internal.service';
import { FeedbackService } from './services/feedback-service/feedback.service';

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
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfigJson),
    AngularFireAuthModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
