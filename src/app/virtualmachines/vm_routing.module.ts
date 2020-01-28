import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VirtualMachineComponent} from '../virtualmachines/addvm.component';
import {ClientOverviewComponent} from './clients/clientOverview.component';
import {VmOverviewComponent} from '../virtualmachines/vmOverview.component';
import {VolumeOverviewComponent} from './volumes/volumeOverview.component';
import {SnapshotOverviewComponent} from './snapshots/snapshotOverview.component';
import {VmDetailComponent} from './vmdetail.component';
import {AddClusterComponent} from './clusters/add-cluster/add-cluster.component';

const routes: Routes = [
    {
        path: 'newVM',
        component: VirtualMachineComponent,
        data: {
            title: 'New Instance'
        }

    },
  {
        path: 'newCluster',
        component: AddClusterComponent,
        data: {
            title: 'New Cluster'
        }

    },
    {
        path: 'clientOverview',
        component: ClientOverviewComponent,
        data: {
            title: 'Client Overview'
        }

    },
    {
        path: 'vmOverview',
        component: VmOverviewComponent,
        data: {
            title: 'VM Overview'
        }

    },
  {
    path: 'detail/:id',
    component: VmDetailComponent,
    data: {
      title: 'VM Detail'
    }

  },
    {
        path: 'volumeOverview',
        component: VolumeOverviewComponent,
        data: {
            title: 'Volumes Overview'
        }

    },
    {
        path: 'snapshotOverview',
        component: SnapshotOverviewComponent,
        data: {
            title: 'Snapshots Overview'
        }

    }
];

/**
 * Vm routing module.
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VmRoutingModule {
}
