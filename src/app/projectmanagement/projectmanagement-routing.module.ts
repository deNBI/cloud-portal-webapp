import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***Routes, RouterModule***REMOVED*** from '@angular/router';
import ***REMOVED***FacilityProjectsOverviewComponent***REMOVED*** from "./facilityprojectsoverview.component";
import ***REMOVED***OverviewComponent***REMOVED*** from './overview.component';
import ***REMOVED***ImageTagComponent***REMOVED*** from "./imagetags.component";

const routes: Routes = [
    ***REMOVED***
        path: 'project-management',
        component: OverviewComponent,
        data: ***REMOVED***
            title: 'Project overview'
        ***REMOVED***

    ***REMOVED***,
    ***REMOVED***
        path: 'facilityProjects',
        component: FacilityProjectsOverviewComponent,
        data: ***REMOVED***
            title: 'Facility Projects'
        ***REMOVED***

    ***REMOVED***, ***REMOVED***
        path: 'imageTags',
        component: ImageTagComponent,
        data: ***REMOVED***
            title: 'Image Tags'
        ***REMOVED***
    ***REMOVED***

];

@NgModule(***REMOVED***
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
***REMOVED***)
export class ProjectManagementRoutingModule ***REMOVED***
***REMOVED***
