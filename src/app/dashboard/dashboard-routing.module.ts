import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes,
     RouterModule ***REMOVED*** from '@angular/router';

import ***REMOVED*** DashboardComponent ***REMOVED*** from './dashboard.component';

const routes: Routes = [
  ***REMOVED***
    path: '',
    component: DashboardComponent,
    data: ***REMOVED***
      title: 'Dashboard'
    ***REMOVED***
  ***REMOVED***
];

@NgModule(***REMOVED***
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
***REMOVED***)
export class DashboardRoutingModule ***REMOVED******REMOVED***
