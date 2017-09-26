import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes, RouterModule ***REMOVED*** from '@angular/router';

import ***REMOVED*** P404Component ***REMOVED*** from './404.component';
import ***REMOVED*** P500Component ***REMOVED*** from './500.component';
import ***REMOVED*** LoginComponent ***REMOVED*** from './login.component';
import ***REMOVED*** RegisterComponent ***REMOVED*** from './register.component';

const routes: Routes = [
  ***REMOVED***
    path: '',
    data: ***REMOVED***
      title: 'Example Pages'
    ***REMOVED***,
    children: [
      ***REMOVED***
        path: '404',
        component: P404Component,
        data: ***REMOVED***
          title: 'Page 404'
        ***REMOVED***
      ***REMOVED***,
      ***REMOVED***
        path: '500',
        component: P500Component,
        data: ***REMOVED***
          title: 'Page 500'
        ***REMOVED***
      ***REMOVED***,
      ***REMOVED***
        path: 'login',
        component: LoginComponent,
        data: ***REMOVED***
          title: 'Login Page'
        ***REMOVED***
      ***REMOVED***,
      ***REMOVED***
        path: 'register',
        component: RegisterComponent,
        data: ***REMOVED***
          title: 'Register Page'
        ***REMOVED***
      ***REMOVED***
    ]
  ***REMOVED***
];

@NgModule(***REMOVED***
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
***REMOVED***)
export class PagesRoutingModule ***REMOVED******REMOVED***
