import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';

import ***REMOVED*** TabsModule ***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED*** UserinfoComponent ***REMOVED*** from './userinfo.component';
import ***REMOVED*** UserinfoRoutingModule ***REMOVED*** from './userinfo-routing.module';
import ***REMOVED***CommonModule***REMOVED*** from "@angular/common";

@NgModule(***REMOVED***
  imports: [
    UserinfoRoutingModule,
    TabsModule,
    CommonModule
  ],
  declarations: [
    UserinfoComponent
  ]
***REMOVED***)
export class UserinfoModule ***REMOVED*** ***REMOVED***
