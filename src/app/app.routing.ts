import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Layouts
import {FullLayoutComponent} from './layouts/full-layout.component';
import {SimpleLayoutComponent} from './layouts/simple-layout.component';
import {MemberGuardService} from './member-guard.service';
import {RegistrationInfoComponent} from "./registration-info.component";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'userinfo',
        pathMatch: 'full',
    },
    {
        path: 'registration-info',
        component: RegistrationInfoComponent,
        pathMatch: 'full'
    },
    {
        path: '',
        component: FullLayoutComponent,
        canActivate: [MemberGuardService],
        canActivateChild: [MemberGuardService],
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


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [MemberGuardService]
})
export class AppRoutingModule {
}
