import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** ChartsModule ***REMOVED*** from 'ng2-charts/ng2-charts';
import ***REMOVED*** BsDropdownModule ***REMOVED*** from 'ngx-bootstrap/dropdown';

import ***REMOVED*** DashboardComponent ***REMOVED*** from './dashboard.component';
import ***REMOVED*** DashboardRoutingModule ***REMOVED*** from './dashboard-routing.module';

@NgModule(***REMOVED***
  imports: [
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule
  ],
  declarations: [ DashboardComponent ]
***REMOVED***)
export class DashboardModule ***REMOVED*** ***REMOVED***
