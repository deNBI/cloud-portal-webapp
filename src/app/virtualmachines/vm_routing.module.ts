import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VirtualMachineComponent} from '../virtualmachines/addvm.component';
import {VmOverviewComponent} from '../virtualmachines/vmOverview.component';
import {VolumeOverviewComponent} from './volumes/volumeOverview.component';
import {SnapshotOverviewComponent} from './snapshots/snapshotOverview.component';
import {VmDetailComponent} from './vmdetail/vmdetail.component';
import {AddClusterComponent} from './clusters/add-cluster/add-cluster.component';
import {ClusterdetailComponent} from './clusters/clusterdetail/clusterdetail.component';
import {ClusterOverviewComponent} from './clusters/clusteroverview/clusterOverview.component';

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
    path: 'vmOverview',
    component: VmOverviewComponent,
    data: {
      title: 'VM Overview'
    }

  },
  {
    path: 'clusterOverview',
    component: ClusterOverviewComponent,
    data: {
      title: 'Cluster Overview'
    }

  },
  {
    path: 'cluster/:id',
    component: ClusterdetailComponent,
    data: {
      title: 'Cluster Detail'
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
