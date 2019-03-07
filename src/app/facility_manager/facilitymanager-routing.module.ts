import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***RouterModule, Routes***REMOVED*** from '@angular/router';
import ***REMOVED***FacilityProjectsOverviewComponent***REMOVED*** from '../facility_manager/facilityprojectsoverview.component';
import ***REMOVED***ImageTagComponent***REMOVED*** from '../facility_manager/imagetags.component';
import ***REMOVED***FacilityApplicationComponent***REMOVED*** from './facility.application.component';
import ***REMOVED***ResourcesComponent***REMOVED*** from './resources/resources.component';

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
    ***REMOVED***, ***REMOVED***
        path: 'facilityApplications',
        component: FacilityApplicationComponent,
        data: ***REMOVED***
            title: 'Facility Applications'
        ***REMOVED***
    ***REMOVED***,
    ***REMOVED***
        path: 'facilityResources',
        component: ResourcesComponent,
        data: ***REMOVED***
            title: 'Facility Resources'
        ***REMOVED***
    ***REMOVED***


];

@NgModule(***REMOVED***
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
***REMOVED***)
export class FacilitymanagerRoutingModule ***REMOVED***
***REMOVED***
