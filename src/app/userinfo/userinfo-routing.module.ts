import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes, RouterModule ***REMOVED*** from '@angular/router';
import ***REMOVED*** UserinfoComponent ***REMOVED*** from './userinfo.component';

const routes: Routes = [
  ***REMOVED***
    path: '',
    component: UserinfoComponent,
    data: ***REMOVED***
      title: 'User information'
    ***REMOVED***

  ***REMOVED***
];

@NgModule(***REMOVED***
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
***REMOVED***)
export class UserinfoRoutingModule ***REMOVED******REMOVED***
