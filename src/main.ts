//--------------------------------------------
//Title: main.ts
//Author: Kyle Hochdoerfer
//Date: 01/24/24
//Description: Main typescript file for Nodebucket
//---------------------------------------------

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
