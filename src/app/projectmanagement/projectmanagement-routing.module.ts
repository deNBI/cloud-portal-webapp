import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OverviewComponent} from './overview.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
    data: {
      title: 'Project overview'
    }

  }
  , {
    path: ':id',
    component: OverviewComponent,
    data: {
      title: 'Project Overview'
    }
  }

];

@NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
          })
export class ProjectManagementRoutingModule {
}
