import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***Routes, RouterModule***REMOVED*** from '@angular/router';
import ***REMOVED***FacilityProjectsOverviewComponent***REMOVED*** from "../facility_manager/facilityprojectsoverview.component";
import ***REMOVED***ImageTagComponent***REMOVED*** from "../facility_manager/imagetags.component";

const routes: Routes = [

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
export class FacilitymanagerRoutingModule ***REMOVED***
***REMOVED***
