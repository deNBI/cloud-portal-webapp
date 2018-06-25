import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FacilityProjectsOverviewComponent} from "../facility_manager/facilityprojectsoverview.component";
import {OverviewComponent} from './overview.component';
import {ImageTagComponent} from "../facility_manager/imagetags.component";

const routes: Routes = [
    {
        path: '',
        component: OverviewComponent,
        data: {
            title: 'Project overview'
        }

    },



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectManagementRoutingModule {
}
