///--------------------------------------------
//Title: signin.component.ts
//Author: Kyle Hochdoerfer
//Date: 01/17/24
//Description: Signin component for nodebucket
//---------------------------------------------

//Import statements
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SecurityService } from '../security.service';

//Create and export session user interface
export interface SessionUser {
  empId: number;
  firstName: string;
  lastName: string;
}

//Create and export signin component
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  //Define variables for error message, session user, and isloading
  errorMessage: string;
  sessionUser: SessionUser;
  isLoading: boolean = false;

  //Use form builder to create a signin form that only accepts numerical values
  signinForm = this.fb.group({
    empId: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]
  });

  //Define a constructor that passes in routing, form builder, and cookie and security service
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private securityService: SecurityService,
    private fb: FormBuilder
  ) {
      //Set default values for error message and session user
      this.sessionUser = {} as SessionUser;
      this.errorMessage = '';
  }

  //Define a function to sign the user in
  signin(){
    //Set isLoading to true, and get the provided ID from the form
    this.isLoading = true;
    console.log("signInForm", this.signinForm.value)
    const empId = this.signinForm.controls['empId'].value

    //If the provided ID is not valid, output an error message and return false
    if (!empId || isNaN(parseInt(empId, 10))) {
      this.errorMessage = "The employee ID is invalid. Please enter a number"
      this.isLoading = false;
      return;
    }

    //Subscribe to the security service and output a message with the found employee's data
    this.securityService.findEmployeeById(empId).subscribe({
      next: (employee: any) => {
        console.log('employee', employee);

        //Set session user to the logged in employee
        this.sessionUser = employee;

        //Give the user two session cookies corresponding to their name and ID
        this.cookieService.set('session_user', empId, 1);
        this.cookieService.set('session_name', `${employee.firstName} ${employee.lastName}`, 1)

        //Create a return url
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

        //Set isloading to false
        this.isLoading = false;

        //Navigate the user to the return url
        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        //In the event of an error, set is loading to false
        this.isLoading = false;

        //Set the value of error message if err.error contains a message
        if (err.error.message) {
          this.errorMessage = err.error.message;
          return
        }

        //Set the value of error message
        this.errorMessage = err.message
      }
    })
  }
}
