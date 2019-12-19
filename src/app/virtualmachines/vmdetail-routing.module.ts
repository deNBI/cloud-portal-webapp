import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VmOverviewComponent} from './vmOverview.component';
import {VmDetailComponent} from './vmdetail.component';

const routes: Routes = [
  {
    path: ':id',
    component: VmDetailComponent,
    data: {
      title: 'Virtual Machine Details'
    }
  },
  {
    path: 'error',
    component: VmOverviewComponent,
    data: {
    }
  }
];

/**
 * Virtual Machine Detail routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VmDetailRoutingModule {
}
