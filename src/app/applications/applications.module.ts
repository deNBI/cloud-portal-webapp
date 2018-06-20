import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';

import ***REMOVED*** TabsModule ***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED*** ApplicationsComponent ***REMOVED*** from './applications.component';
import ***REMOVED*** ApplicationsRoutingModule ***REMOVED*** from './applications-routing.module';
import ***REMOVED***CommonModule***REMOVED*** from "@angular/common";
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED*** ModalModule ***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED***ImageDetailComponent***REMOVED*** from "../virtualmachines/imagedetail.component";
import ***REMOVED***VirtualMachineComponent***REMOVED*** from "../virtualmachines/addvm.component";
import ***REMOVED***FlavorDetailComponent***REMOVED*** from '../virtualmachines/flavordetail.component';
import ***REMOVED***ClientOverviewComponent***REMOVED*** from "../virtualmachines/vmClients.component";
import ***REMOVED***UserinfoComponent***REMOVED*** from "../userinfo/userinfo.component";
import ***REMOVED***VmOverviewComponent***REMOVED*** from "../virtualmachines/vmOverview.component";
import ***REMOVED***AddsinglevmComponent***REMOVED*** from "./addsinglevm.component";
import ***REMOVED***AddcloudapplicationComponent***REMOVED*** from "./addcloudapplication.component";


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
      AddsinglevmComponent,
      AddcloudapplicationComponent,
  ]
***REMOVED***)
export class ApplicationsModule ***REMOVED*** ***REMOVED***
