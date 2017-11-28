import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';

import ***REMOVED*** P404Component ***REMOVED*** from './404.component';
import ***REMOVED*** P500Component ***REMOVED*** from './500.component';
import ***REMOVED*** LoginComponent ***REMOVED*** from './login.component';
import ***REMOVED*** RegisterComponent ***REMOVED*** from './register.component';

import ***REMOVED*** PagesRoutingModule ***REMOVED*** from './pages-routing.module';

@NgModule(***REMOVED***
  imports: [ PagesRoutingModule ],
  declarations: [
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent
  ]
***REMOVED***)
export class PagesModule ***REMOVED*** ***REMOVED***
