import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { OverviewComponent } from './overview.component';
import { ProjectManagementRoutingModule } from './projectmanagement-routing.module';
import {CommonModule} from "@angular/common";
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  imports: [
    ProjectManagementRoutingModule,
    TabsModule,
    CommonModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    OverviewComponent
  ]
})
export class ProjectManagementModule { }
