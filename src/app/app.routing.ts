import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***RouterModule, Routes***REMOVED*** from '@angular/router';
// Layouts
import ***REMOVED***ConsentInfoComponent***REMOVED*** from './consent-info.component';
import ***REMOVED***FullLayoutComponent***REMOVED*** from './layouts/full-layout.component';
import ***REMOVED***MemberGuardService***REMOVED*** from './member-guard.service';
import ***REMOVED***RegistrationInfoComponent***REMOVED*** from './registration-info.component';
import ***REMOVED***ValidationApplicationComponent***REMOVED*** from "./validation-application/validation-application.component";

export const routes: Routes = [
  ***REMOVED***
    path: '',
    redirectTo: 'userinfo',
    pathMatch: 'full'
  ***REMOVED***,
  ***REMOVED***
    path: 'applications/validation/:hash',
    component: ValidationApplicationComponent
  ***REMOVED***,
  ***REMOVED***
    path: 'registration-info',
    component: RegistrationInfoComponent,
    pathMatch: 'full'
  ***REMOVED***,
  ***REMOVED***
    path: 'consent-info',
    component: ConsentInfoComponent,
    pathMatch: 'full'
  ***REMOVED***,
  ***REMOVED***
    path: '',
    component: FullLayoutComponent,
    canActivate: [MemberGuardService],
    canActivateChild: [MemberGuardService],
    data: ***REMOVED***
      title: 'de.NBI Cloud Portal'
    ***REMOVED***,
    children: [
      ***REMOVED***
        path: 'userinfo',
        loadChildren: './userinfo/userinfo.module#UserinfoModule'
      ***REMOVED***,
      ***REMOVED***
        path: 'help',
        loadChildren: './help/help.module#HelpModule'
      ***REMOVED***,
      ***REMOVED***
        path: 'project-management',
        loadChildren: './projectmanagement/projectmanagement.module#ProjectManagementModule'
      ***REMOVED***,
      ***REMOVED***
        path: 'applications',
        loadChildren: './applications/applications.module#ApplicationsModule'
      ***REMOVED***,
      ***REMOVED***
        path: 'virtualmachines',
        loadChildren: './virtualmachines/vm.module#VmModule'
      ***REMOVED***,
      ***REMOVED***
        path: 'vo-manager',
        loadChildren: './vo_manager/VoManager.module#VoManagerModule'
      ***REMOVED***,
      ***REMOVED***
        path: 'facility-manager',
        loadChildren: './facility_manager/facilitymanager.module#FacilitymanagerModule'
      ***REMOVED***

    ]
  ***REMOVED***
];

/**
 * App routing module.
 */
@NgModule(***REMOVED***
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [MemberGuardService]
***REMOVED***)
export class AppRoutingModule ***REMOVED***
***REMOVED***
