import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes, RouterModule ***REMOVED*** from '@angular/router';
import  ***REMOVED*** ImageDetailComponent***REMOVED*** from '../virtualmachines/imagedetail.component';
import ***REMOVED*** VirtualMachineComponent***REMOVED*** from '../virtualmachines/addvm.component';
import ***REMOVED***ClientOverviewComponent***REMOVED*** from "../virtualmachines/vmClients.component";
import ***REMOVED***VmOverviewComponent***REMOVED*** from "../virtualmachines/vmOverview.component";

const routes: Routes = [
  ***REMOVED***
    path: 'newVM',
    component: VirtualMachineComponent,
       data: ***REMOVED***
      title: 'New Instance'
    ***REMOVED***

  ***REMOVED***,
  ***REMOVED***
    path:'clientOverview',
    component:ClientOverviewComponent,
    data: ***REMOVED***
      title: 'Client Overview'
    ***REMOVED***

  ***REMOVED***,
  ***REMOVED***
    path:'vmOverview',
    component:VmOverviewComponent,
    data: ***REMOVED***
      title: 'VM Overview'
    ***REMOVED***

  ***REMOVED***,
];

@NgModule(***REMOVED***
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
***REMOVED***)
export class VmRoutingModule ***REMOVED******REMOVED***
