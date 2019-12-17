import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VmOverviewComponent} from './vmOverview.component';
import {VmDetailComponent} from './vmdetail.component';

const routes: Routes = [
  {
    path: '',
    component: VmDetailComponent,
    data: {
      title: 'Virtual Machine Details'
    }

  }
  , {
    path: ':id',
    component: VmDetailComponent,
    data: {
      title: 'Virtua Machine Details'
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
