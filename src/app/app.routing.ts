import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'userinfo',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'de.NBI Portal'
    },
    children: [
      {
        path: 'userinfo',
        loadChildren: './userinfo/userinfo.module#UserinfoModule'
      },
      {
        path: 'project-management',
        loadChildren: './projectmanagement/projectmanagement.module#ProjectManagementModule'
      },
      {
        path: 'applications',
        loadChildren: './applications/applications.module#ApplicationsModule'
      }

    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
