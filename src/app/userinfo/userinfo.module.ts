import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';

import ***REMOVED*** TabsModule ***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED*** UserinfoComponent ***REMOVED*** from './userinfo.component';
import ***REMOVED*** UserinfoRoutingModule ***REMOVED*** from './userinfo-routing.module';
import ***REMOVED***CommonModule***REMOVED*** from "@angular/common";
import ***REMOVED***FormsModule***REMOVED*** from "@angular/forms";

@NgModule(***REMOVED***
  imports: [
    UserinfoRoutingModule,
    TabsModule,
    CommonModule,
    FormsModule
  ],
  declarations: [
    UserinfoComponent
  ]
***REMOVED***)
export class UserinfoModule ***REMOVED*** ***REMOVED***
