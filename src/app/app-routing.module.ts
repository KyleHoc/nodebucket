/**
 * Title: app-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { HomeComponent } from './home/home.component';
import { TasksComponent } from './tasks/tasks.component';
import { authGuard } from './shared/auth.guard';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './not-found/not-found.component';
// routes array with a path, component, and title for each route in the application (e.g. home, about, contact, etc.)
const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Nodebucket: Home' // title for the home page
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'Nodebucket: Home'
      },
      {
        path: 'task-management',
        component: TasksComponent,
        canActivate: [authGuard],
        title: "Nodebucket: Tasks"
      },
      {
        path: 'contact',
        component: ContactComponent,
        title: "Nodebucket: Contact"
      },
      {
        path: 'about',
        component: AboutComponent,
        title: "Nodebucket: About"
      }
    ]
  },
  {
    // path for the security module (e.g. login, register, forgot password, etc.)
    path: 'security',
    loadChildren: () => import('./security/security.module').then(m => m.SecurityModule)
  },
  {
        path: '**',
        component: NotFoundComponent
  },
];

@NgModule({
  // imports the RouterModule and defines the routes array and other options (e.g. useHash, enableTracing, scrollPositionRestoration)
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false, scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
