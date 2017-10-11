import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserinfoComponent } from './userinfo.component';

const routes: Routes = [
  {
    path: '',
    component: UserinfoComponent,
    data: {
      title: 'User information'
    }

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserinfoRoutingModule {}
