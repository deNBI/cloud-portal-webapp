import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';

import ***REMOVED*** TabsModule ***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED*** ApplicationsComponent ***REMOVED*** from './applications.component';
import ***REMOVED*** AddApplicationComponent ***REMOVED*** from './addapplication.component';
import ***REMOVED*** ApplicationsRoutingModule ***REMOVED*** from './applications-routing.module';
import ***REMOVED***CommonModule***REMOVED*** from "@angular/common";
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED*** ModalModule ***REMOVED*** from 'ngx-bootstrap/modal';

@NgModule(***REMOVED***
  imports: [
    ApplicationsRoutingModule,
    TabsModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  declarations: [
    ApplicationsComponent,
    AddApplicationComponent

  ]
***REMOVED***)
export class ApplicationsModule ***REMOVED*** ***REMOVED***
