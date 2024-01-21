/**
 * Title: security-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { SigninComponent } from './signin/signin.component';

//Create security routing
const routes: Routes = [
  {
    //Route protected routes to the signin page by default
    path: '',
    component: SecurityComponent,
    children: [
      {
        path:"signin",
        component: SigninComponent,
        title: "Nodebucket: Sign-In"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
