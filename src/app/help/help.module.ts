import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** TabsModule ***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED***HelpComponent***REMOVED*** from "../help/help.component";
import ***REMOVED***HelpRoutingModule***REMOVED*** from "./help-routing.module";
import ***REMOVED***CommonModule***REMOVED*** from "@angular/common";
import ***REMOVED***FormsModule***REMOVED*** from "@angular/forms";
import ***REMOVED*** ModalModule ***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED*** AlertModule ***REMOVED*** from 'ngx-bootstrap';

@NgModule(***REMOVED***
  imports: [
    HelpRoutingModule,
    TabsModule,
    CommonModule,
    FormsModule, ModalModule.forRoot(),
      AlertModule.forRoot()
  ],

  declarations: [
    HelpComponent,
  ]
***REMOVED***)
export class HelpModule ***REMOVED*** ***REMOVED***
