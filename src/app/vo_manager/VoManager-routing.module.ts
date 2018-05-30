import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {VoOverviewComponent} from "./VoOverviewComponent";
import {VoGuardService} from "./vo-guard.service";


const routes: Routes = [
    {
        path: 'overview',
        component: VoOverviewComponent,
        canActivate:[VoGuardService],
        data: {
            title: 'Vo manager overview'
        }

    },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VoManagerRoutingModule {
}
