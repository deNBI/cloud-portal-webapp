import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicationsComponent } from './applications.component';
import { AddApplicationComponent } from './addapplication.component';
import  { ImageDetailComponent} from './imagedetail.component';
import { VirtualMachineComponent} from './addvm.component';
const routes: Routes = [
  {
    path: '',
    component: ApplicationsComponent,
    data: {
      title: 'Application overview'
    }

  },
  {
    path: 'new',
    component: AddApplicationComponent,
    data: {
      title: 'New Application'
    }

  },
  {
    path: 'newVM',
    component: VirtualMachineComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationsRoutingModule {}
