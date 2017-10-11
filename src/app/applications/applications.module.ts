import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';

import ***REMOVED*** TabsModule ***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED*** ApplicationsComponent ***REMOVED*** from './applications.component';
import ***REMOVED*** ApplicationsRoutingModule ***REMOVED*** from './applications-routing.module';
import ***REMOVED***CommonModule***REMOVED*** from "@angular/common";

@NgModule(***REMOVED***
  imports: [
    ApplicationsRoutingModule,
    TabsModule,
    CommonModule
  ],
  declarations: [
    ApplicationsComponent
  ]
***REMOVED***)
export class ApplicationsModule ***REMOVED*** ***REMOVED***
