import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***RouterModule, Routes***REMOVED*** from '@angular/router';
import ***REMOVED***VoOverviewComponent***REMOVED*** from './VoOverviewComponent';
import ***REMOVED***VoGuardService***REMOVED*** from './vo-guard.service';
import ***REMOVED***ResourcesComponent***REMOVED*** from './resources/resources.component';


const routes: Routes = [
    ***REMOVED***
        path: 'overview',
        component: VoOverviewComponent,
        canActivate: [VoGuardService],
        data: ***REMOVED***
            title: 'Vo manager overview'
        ***REMOVED***
    ***REMOVED***
    , ***REMOVED***
        path: 'resources',
        component: ResourcesComponent,
        canActivate: [VoGuardService],
        data: ***REMOVED***
            title: 'Vo Resources'
        ***REMOVED***


    ***REMOVED***,


];

@NgModule(***REMOVED***
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
***REMOVED***)
export class VoManagerRoutingModule ***REMOVED***
***REMOVED***
