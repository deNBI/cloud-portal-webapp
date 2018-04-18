import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***Routes, RouterModule***REMOVED*** from '@angular/router';

// Layouts
import ***REMOVED***FullLayoutComponent***REMOVED*** from './layouts/full-layout.component';
import ***REMOVED***SimpleLayoutComponent***REMOVED*** from './layouts/simple-layout.component';
import ***REMOVED***MemberGuardService***REMOVED*** from './member-guard.service';
import ***REMOVED***RegistrationInfoComponent***REMOVED*** from "./registration-info.component";

export const routes: Routes = [
    ***REMOVED***
        path: '',
        redirectTo: 'userinfo',
        pathMatch: 'full',
    ***REMOVED***,
    ***REMOVED***
        path: 'registration-info',
        component: RegistrationInfoComponent,
        pathMatch: 'full'
    ***REMOVED***,
    ***REMOVED***
        path: '',
        component: FullLayoutComponent,
        canActivate: [MemberGuardService],
        data: ***REMOVED***
            title: 'de.NBI Portal'
        ***REMOVED***,
        children: [
            ***REMOVED***
                path: 'userinfo',
                loadChildren: './userinfo/userinfo.module#UserinfoModule'
            ***REMOVED***,
            ***REMOVED***
                path: '',
                loadChildren: './projectmanagement/projectmanagement.module#ProjectManagementModule'
            ***REMOVED***,
            ***REMOVED***
                path: '',
                loadChildren: './applications/applications.module#ApplicationsModule'
            ***REMOVED***,
            ***REMOVED***
                path: '',
                loadChildren: './virtualmachines/vm.module#VmModule'
            ***REMOVED***

        ]
    ***REMOVED***
];


@NgModule(***REMOVED***
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [MemberGuardService]
***REMOVED***)
export class AppRoutingModule ***REMOVED***
***REMOVED***
