import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes, RouterModule ***REMOVED*** from '@angular/router';

import ***REMOVED*** ApplicationsComponent ***REMOVED*** from './applications.component';
import ***REMOVED*** AddApplicationComponent ***REMOVED*** from './addapplication.component';
import  ***REMOVED*** ImageDetailComponent***REMOVED*** from './imagedetail.component';
import ***REMOVED*** VirtualMachineComponent***REMOVED*** from './addvm.component';
import ***REMOVED***ClientOverviewComponent***REMOVED*** from "./vmClients.component";
import ***REMOVED***VmOverviewComponent***REMOVED*** from "./vmOverview.component";

const routes: Routes = [
  ***REMOVED***
    path: '',
    component: ApplicationsComponent,
    data: ***REMOVED***
      title: 'Application overview'
    ***REMOVED***

  ***REMOVED***,
  ***REMOVED***
    path: 'new',
    component: AddApplicationComponent,
    data: ***REMOVED***
      title: 'New Application'
    ***REMOVED***

  ***REMOVED***,
  ***REMOVED***
    path: 'newVM',
    component: VirtualMachineComponent,

  ***REMOVED***,
  ***REMOVED***
    path:'clientOverview',
    component:ClientOverviewComponent,
  ***REMOVED***,
  ***REMOVED***
    path:'vmOverview',
    component:VmOverviewComponent,
  ***REMOVED***,
];

@NgModule(***REMOVED***
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
***REMOVED***)
export class ApplicationsRoutingModule ***REMOVED******REMOVED***
