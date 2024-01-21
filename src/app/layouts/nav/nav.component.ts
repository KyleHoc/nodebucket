/**
 * Title: nav.component.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

//Export and create appUser interface
export interface AppUser {
  fullName: string;
}

//Create nav component
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  //Define variables for appUser and isLoggedIn
  appUser: AppUser;
  isLoggedIn: boolean;

  //Define a constructor that checks if the current user is logged in
  constructor(private cookieService: CookieService){
    this.appUser = {} as AppUser;
    this.isLoggedIn = this.cookieService.get('session_user') ? true : false;

    //If the user is logged in, provide their name to the cookie servic
    if (this.isLoggedIn) {
      this.appUser = {
        fullName: this.cookieService.get('session_name')
      }
    }
  }

  //Create a function that signs the user out and deletes all cookies
  signout(){
    console.log("Signing out...");
    this.cookieService.deleteAll();
    window.location.href = '/'
  }

}
