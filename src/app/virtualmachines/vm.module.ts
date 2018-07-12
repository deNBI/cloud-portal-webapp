import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';

import ***REMOVED*** TabsModule ***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED*** VmRoutingModule ***REMOVED*** from './vm_routing.module';
import ***REMOVED***CommonModule***REMOVED*** from "@angular/common";
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED*** ModalModule ***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED***ImageDetailComponent***REMOVED*** from "../virtualmachines/imagedetail.component";
import ***REMOVED***VirtualMachineComponent***REMOVED*** from "../virtualmachines/addvm.component";
import ***REMOVED***FlavorDetailComponent***REMOVED*** from '../virtualmachines/flavordetail.component';
import ***REMOVED***ClientOverviewComponent***REMOVED*** from "../virtualmachines/vmClients.component";
import ***REMOVED***VmOverviewComponent***REMOVED*** from "../virtualmachines/vmOverview.component";
import ***REMOVED*** VolumeOverviewComponent***REMOVED*** from "./volumeOverview.component";


@NgModule(***REMOVED***
  imports: [
    VmRoutingModule,
    TabsModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),


  ],
  declarations: [
    ImageDetailComponent,
    VirtualMachineComponent,
    FlavorDetailComponent,
    ClientOverviewComponent,
    VmOverviewComponent,
      VolumeOverviewComponent,
  ]
***REMOVED***)
export class VmModule ***REMOVED*** ***REMOVED***
