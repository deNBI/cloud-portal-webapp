import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Layouts
import {ConsentInfoComponent} from './consent-info.component';
import {FullLayoutComponent} from './layouts/full-layout.component';
import {MemberGuardService} from './member-guard.service';
import {RegistrationInfoComponent} from './registration-info.component';
import {ValidationApplicationComponent} from './validation-application/validation-application.component';

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
        loadChildren: './userinfo/userinfo.module#UserinfoModule'
      },
      {
        path: 'help',
        loadChildren: './help/help.module#HelpModule'
      },
      {
        path: 'project-management',
        loadChildren: './projectmanagement/projectmanagement.module#ProjectManagementModule'
      },
      {
        path: 'applications',
        loadChildren: './applications/applications.module#ApplicationsModule'
      },
      {
        path: 'virtualmachines',
        loadChildren: './virtualmachines/vm.module#VmModule'
      },
      {
        path: 'vo-manager',
        loadChildren: './vo_manager/VoManager.module#VoManagerModule'
      },
      {
        path: 'facility-manager',
        loadChildren: './facility_manager/facilitymanager.module#FacilitymanagerModule'
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
  providers: [MemberGuardService]
})
export class AppRoutingModule {
}
