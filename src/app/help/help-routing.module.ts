import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***RouterModule, Routes***REMOVED*** from '@angular/router';
import ***REMOVED***HelpComponent***REMOVED*** from '../help/help.component';

const routes: Routes = [
    ***REMOVED***
        path: '',
        component: HelpComponent,
        data: ***REMOVED***
            title: 'Help'
        ***REMOVED***

    ***REMOVED***
];

@NgModule(***REMOVED***
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
***REMOVED***)
export class HelpRoutingModule ***REMOVED***
***REMOVED***
