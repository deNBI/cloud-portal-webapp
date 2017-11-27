import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';

import ***REMOVED*** TabsModule ***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED*** ApplicationsComponent ***REMOVED*** from './applications.component';
import ***REMOVED*** AddApplicationComponent ***REMOVED*** from './addapplication.component';
import ***REMOVED*** ApplicationsRoutingModule ***REMOVED*** from './applications-routing.module';
import ***REMOVED***CommonModule***REMOVED*** from "@angular/common";
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED*** ModalModule ***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED***ImageDetailComponent***REMOVED*** from "./imagedetail.component";
import ***REMOVED***VirtualMachineComponent***REMOVED*** from "./addvm.component";
import ***REMOVED***FlavorDetailComponent***REMOVED*** from './flavordetail.component';
import ***REMOVED***ClientOverviewComponent***REMOVED*** from "./vmClients.component";
import ***REMOVED***UserinfoComponent***REMOVED*** from "../userinfo/userinfo.component";
import ***REMOVED***VmOverviewComponent***REMOVED*** from "./vmOverview.component";


@NgModule(***REMOVED***
  imports: [
    ApplicationsRoutingModule,
    TabsModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),


  ],
  declarations: [
    ApplicationsComponent,
    AddApplicationComponent,
    ImageDetailComponent,
    VirtualMachineComponent,
    FlavorDetailComponent,
    ClientOverviewComponent,
    VmOverviewComponent,
  ]
***REMOVED***)
export class ApplicationsModule ***REMOVED*** ***REMOVED***
