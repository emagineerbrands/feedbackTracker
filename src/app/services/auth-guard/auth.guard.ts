import { Injectable } from '@angular/core';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FeedbackService } from '../feedback-service/feedback.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, OnInit {
  constructor(private service: FeedbackService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if the user is authenticated
    const authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');
    if (!authUser.isAuthenticated) {
      // Redirect to the login page if not authenticated
      this.router.navigate(['']);
      return false;
    }



    // Check if the user has the required privilege
    const requiredPrivilege: string[] = route.data['requiredPrivilege'];
    const userPrivilege = authUser.role_value; // Implement this method in your AuthService
    if (requiredPrivilege && userPrivilege.some(role => requiredPrivilege.includes(role))) {
      return true;
    } else {
      // Redirect to an unauthorized page or handle unauthorized access as needed
      return false;
    }
  }

  ngOnInit(): void {
  }

}
