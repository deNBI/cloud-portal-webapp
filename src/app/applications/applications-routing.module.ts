import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes, RouterModule ***REMOVED*** from '@angular/router';

import ***REMOVED*** ApplicationsComponent ***REMOVED*** from './applications.component';

const routes: Routes = [
  ***REMOVED***
    path: '',
    component: ApplicationsComponent,
    data: ***REMOVED***
      title: 'Application overview'
    ***REMOVED***

  ***REMOVED***
];

@NgModule(***REMOVED***
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
***REMOVED***)
export class ApplicationsRoutingModule ***REMOVED******REMOVED***
