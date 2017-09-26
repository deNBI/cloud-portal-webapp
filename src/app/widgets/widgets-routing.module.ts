import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes, RouterModule ***REMOVED*** from '@angular/router';

import ***REMOVED*** WidgetsComponent ***REMOVED*** from './widgets.component';

const routes: Routes = [
  ***REMOVED***
    path: '',
    component: WidgetsComponent,
    data: ***REMOVED***
      title: 'Widgets'
    ***REMOVED***
  ***REMOVED***
];

@NgModule(***REMOVED***
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
***REMOVED***)
export class WidgetsRoutingModule ***REMOVED******REMOVED***
