import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicationsComponent } from './applications.component';
import { AddApplicationComponent } from './addapplication.component';
import {AddsinglevmComponent} from "./addsinglevm.component";


const routes: Routes = [
  {
    path: '',
    component: ApplicationsComponent,
    data: {
      title: 'Application overview'
    }

  },
  {
    path: 'newApplication',
    component: AddApplicationComponent,
    data: {
      title: 'New Application'
    }

  },
    {
        path: 'newSingleVmApplication',
    component: AddsinglevmComponent,
    data: {
      title: 'New Application'
    }


    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationsRoutingModule {}
