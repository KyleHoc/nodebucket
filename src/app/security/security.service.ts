///--------------------------------------------
//Title: security.service.js
//Author: Kyle Hochdoerfer
//Date: 01/17/24
//Description: Security service for nodebucket
//---------------------------------------------

//Import statements
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//Create and export the security service
@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  //Declare a constructor that passes in httpClient
  constructor(private http: HttpClient) { }

  //Create a function to find and return an employee by ID number
  findEmployeeById(empId: number){
    return this.http.get('/api/employees/' + empId)
  }
}
