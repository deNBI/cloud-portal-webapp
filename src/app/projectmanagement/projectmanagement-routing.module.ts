import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes, RouterModule ***REMOVED*** from '@angular/router';

import ***REMOVED*** OverviewComponent ***REMOVED*** from './overview.component';

const routes: Routes = [
  ***REMOVED***
    path: '',
    component: OverviewComponent,
    data: ***REMOVED***
      title: 'Project overview'
    ***REMOVED***

  ***REMOVED***
];

@NgModule(***REMOVED***
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
***REMOVED***)
export class ProjectManagementRoutingModule ***REMOVED******REMOVED***
