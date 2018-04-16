import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FacilityProjectsOverviewComponent} from "./facilityprojectsoverview.component";
import { OverviewComponent } from './overview.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
    data: {
      title: 'Project overview'
    }

  },
      {
    path: 'facilityProjects',
    component: FacilityProjectsOverviewComponent,
    data: {
      title: 'Facility Projects'
    }

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagementRoutingModule {}
