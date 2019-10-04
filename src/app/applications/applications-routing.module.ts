import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***RouterModule, Routes***REMOVED*** from '@angular/router';

import ***REMOVED***ApplicationsComponent***REMOVED*** from './applications.component';

import ***REMOVED***AddsimplevmComponent***REMOVED*** from './addsimplevm.component';
import ***REMOVED***AddcloudapplicationComponent***REMOVED*** from './addcloudapplication.component';
import ***REMOVED***TypeOverviewComponent***REMOVED*** from './type-overview.component';
import ***REMOVED***ValidationApplicationComponent***REMOVED*** from '../validation-application/validation-application.component';

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
    path: 'newSimpleVmApplication',
    component: AddsimplevmComponent,
    data: ***REMOVED***
      title: 'New Application'
    ***REMOVED***

  ***REMOVED***,
  ***REMOVED***
    path: 'type-overview',
    component: TypeOverviewComponent,
    data: ***REMOVED***
      title: 'Project Types Overview'
    ***REMOVED***
  ***REMOVED***,
  ***REMOVED***
    path: 'validation/:hash',
    component: ValidationApplicationComponent,
    data: ***REMOVED***
      title: 'Application Validation'
    ***REMOVED***
  ***REMOVED***,

];

/**
 * Application routing module.
 */
@NgModule(***REMOVED***
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
          ***REMOVED***)
export class ApplicationsRoutingModule ***REMOVED***
***REMOVED***
