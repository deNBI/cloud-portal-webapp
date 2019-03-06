import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import  { ImageDetailComponent} from '../virtualmachines/imagedetail.component';
import { VirtualMachineComponent} from '../virtualmachines/addvm.component';
import {ClientOverviewComponent} from '../virtualmachines/vmClients.component';
import {VmOverviewComponent} from '../virtualmachines/vmOverview.component';
import { VolumeOverviewComponent} from './volumeOverview.component';
import {SnapshotOverviewComponent} from './snapshotOverview.component';

const routes: Routes = [
  {
    path: 'newVM',
    component: VirtualMachineComponent,
       data: {
      title: 'New Instance'
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

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VmRoutingModule {}
