import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***RouterModule, Routes***REMOVED*** from '@angular/router';
import ***REMOVED***UserInfoComponent***REMOVED*** from './userinfo.component';

const routes: Routes = [
    ***REMOVED***
        path: '',
        component: UserInfoComponent,
        data: ***REMOVED***
            title: 'User information'
        ***REMOVED***

    ***REMOVED***
];

@NgModule(***REMOVED***
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
***REMOVED***)
export class UserInfoRoutingModule ***REMOVED***
***REMOVED***
