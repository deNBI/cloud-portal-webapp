import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes, RouterModule ***REMOVED*** from '@angular/router';

import ***REMOVED*** ApplicationsComponent ***REMOVED*** from './applications.component';

import ***REMOVED***AddsinglevmComponent***REMOVED*** from './addsinglevm.component';
import ***REMOVED***AddcloudapplicationComponent***REMOVED*** from './addcloudapplication.component';


const routes: Routes = [
  ***REMOVED***
    path: '',
    component: ApplicationsComponent,
    data: ***REMOVED***
      title: 'Application overview'
    ***REMOVED***

  ***REMOVED***,
  ***REMOVED***
    path: 'newCloudApplication',
    component: AddcloudapplicationComponent,
    data: ***REMOVED***
      title: 'New Application'
    ***REMOVED***

  ***REMOVED***,
    ***REMOVED***
        path: 'newSingleVmApplication',
    component: AddsinglevmComponent,
    data: ***REMOVED***
      title: 'New Application'
    ***REMOVED***


    ***REMOVED***

];

@NgModule(***REMOVED***
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
***REMOVED***)
export class ApplicationsRoutingModule ***REMOVED******REMOVED***
