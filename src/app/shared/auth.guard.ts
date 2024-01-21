///--------------------------------------------
//Title: auth.guard.ts
//Author: Kyle Hochdoerfer
//Date: 01/17/24
//Description: Authentication guard for Nodebucket
//---------------------------------------------

//Import statements
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

//Export and create an auth guard
export const authGuard: CanActivateFn = (route, state) => {

  //Create a cookie variable
  const cookie = inject(CookieService)

  //Determine if the user has an authentication cookie, and is therefore logged in
  if(cookie.get('session_user')){
    //If the user has a cookie, output a message stating that they're logged in and return true
    console.log("User is logged in and can access the task page")
    return true
  } else {
    //If the user does not have an auth cookie, output a message stating they must be logged in to access the tasks page
    console.log("You must be logged in to access this page")

    //Navigate the unauthenticated user to the sign in page, and return false
    const router = inject(Router)
    router.navigate(['/security/signin'], { queryParams: { returnUrl: state.url }})
    return false
  }
};
