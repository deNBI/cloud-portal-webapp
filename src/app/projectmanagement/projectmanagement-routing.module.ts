import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FacilityProjectsOverviewComponent} from "./facilityprojectsoverview.component";
import {OverviewComponent} from './overview.component';
import {ImageTagComponent} from "./imagetags.component";

const routes: Routes = [
    {
        path: 'project-management',
        component: OverviewComponent,
        data: {
            title: 'Project overview'
        }

    },
    {
        path: 'facilityProjects',
        component: FacilityProjectsOverviewComponent,
        data: {
            title: 'Facility Projects'
        }

    }, {
        path: 'imageTags',
        component: ImageTagComponent,
        data: {
            title: 'Image Tags'
        }
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectManagementRoutingModule {
}
