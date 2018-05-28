import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FacilityProjectsOverviewComponent} from "../facility_manager/facilityprojectsoverview.component";
import {ImageTagComponent} from "../facility_manager/imagetags.component";

const routes: Routes = [

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
export class FacilitymanagerRoutingModule {
}
