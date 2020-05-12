/* tslint:disable */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Layouts
import {ConsentInfoComponent} from './consent-info.component';
import {FullLayoutComponent} from './layouts/full-layout.component';
import {MemberGuardService} from './member-guard.service';
import {RegistrationInfoComponent} from './registration-info.component';
import {LoggedIn_guard} from './logged-in_guard.';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'userinfo',
    pathMatch: 'full'
  },
  {
    path: 'registration-info',
    component: RegistrationInfoComponent,
    pathMatch: 'full'
  },
  {
    path: 'consent-info',
    component: ConsentInfoComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    component: FullLayoutComponent,
    canActivate: [MemberGuardService],
    data: {
      title: 'de.NBI Cloud Portal'
    },
    children: [
      {
        path: 'userinfo',
        canActivate: [LoggedIn_guard],

        loadChildren: () => import('./userinfo/userinfo.module').then(m => m.UserinfoModule)
      },
      {
        path: 'help',
        canActivate: [LoggedIn_guard],

        loadChildren: () => import('./help/help.module').then(m => m.HelpModule)

      },
      {
        path: 'project-management',
        canActivate: [LoggedIn_guard],

        loadChildren: () => import('./projectmanagement/projectmanagement.module').then(m => m.ProjectManagementModule)
      },
      {
        path: 'applications',
        canActivate: [LoggedIn_guard],

        loadChildren: () => import('./applications/applications.module').then(m => m.ApplicationsModule)
      },
      {
        path: 'virtualmachines',
        canActivate: [LoggedIn_guard],

        loadChildren: () => import('./virtualmachines/vm.module').then(m => m.VmModule)
      },
      {
        path: 'vo-manager',
        loadChildren: () => import('./vo_manager/VoManager.module').then(m => m.VoManagerModule)
      },
      {
        path: 'facility-manager',
        canActivate: [LoggedIn_guard],

        loadChildren: () => import('./facility_manager/facilitymanager.module').then(m => m.FacilitymanagerModule)
      }

    ]
  }
];

/**
 * App routing module.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
            providers: [MemberGuardService, LoggedIn_guard]
})
export class AppRoutingModule {
}
