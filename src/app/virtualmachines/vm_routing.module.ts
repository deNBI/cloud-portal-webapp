import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***RouterModule, Routes***REMOVED*** from '@angular/router';
import ***REMOVED***VirtualMachineComponent***REMOVED*** from '../virtualmachines/addvm.component';
import ***REMOVED***ClientOverviewComponent***REMOVED*** from './clients/clientOverview.component';
import ***REMOVED***VmOverviewComponent***REMOVED*** from '../virtualmachines/vmOverview.component';
import ***REMOVED***VolumeOverviewComponent***REMOVED*** from './volumes/volumeOverview.component';
import ***REMOVED***SnapshotOverviewComponent***REMOVED*** from './snapshots/snapshotOverview.component';

const routes: Routes = [
    ***REMOVED***
        path: 'newVM',
        component: VirtualMachineComponent,
        data: ***REMOVED***
            title: 'New Instance'
        ***REMOVED***

    ***REMOVED***,
    ***REMOVED***
        path: 'clientOverview',
        component: ClientOverviewComponent,
        data: ***REMOVED***
            title: 'Client Overview'
        ***REMOVED***

    ***REMOVED***,
    ***REMOVED***
        path: 'vmOverview',
        component: VmOverviewComponent,
        data: ***REMOVED***
            title: 'VM Overview'
        ***REMOVED***

    ***REMOVED***,
    ***REMOVED***
        path: 'volumeOverview',
        component: VolumeOverviewComponent,
        data: ***REMOVED***
            title: 'Volumes Overview'
        ***REMOVED***

    ***REMOVED***,
    ***REMOVED***
        path: 'snapshotOverview',
        component: SnapshotOverviewComponent,
        data: ***REMOVED***
            title: 'Snapshots Overview'
        ***REMOVED***

    ***REMOVED***
];

/**
 * Vm routing module.
 */
@NgModule(***REMOVED***
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
***REMOVED***)
export class VmRoutingModule ***REMOVED***
***REMOVED***
