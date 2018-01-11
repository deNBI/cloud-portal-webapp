import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes, RouterModule ***REMOVED*** from '@angular/router';

import ***REMOVED*** ChartJSComponent ***REMOVED*** from './chartjs.component';

const routes: Routes = [
  ***REMOVED***
    path: '',
    component: ChartJSComponent,
    data: ***REMOVED***
      title: 'Charts'
    ***REMOVED***
  ***REMOVED***
];

@NgModule(***REMOVED***
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
***REMOVED***)
export class ChartJSRoutingModule ***REMOVED******REMOVED***
