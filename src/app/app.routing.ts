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
        data: {
            title: 'de.NBI Portal'
        },
        children: [
            {
                path: 'userinfo',
                loadChildren: './userinfo/userinfo.module#UserinfoModule'
            },
            {
                path: '',
                loadChildren: './projectmanagement/projectmanagement.module#ProjectManagementModule'
            },
            {
                path: '',
                loadChildren: './applications/applications.module#ApplicationsModule'
            },
            {
                path: '',
                loadChildren: './virtualmachines/vm.module#VmModule'
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
