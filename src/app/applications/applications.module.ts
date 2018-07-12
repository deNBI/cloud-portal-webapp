import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { ApplicationsComponent } from './applications.component';
import { ApplicationsRoutingModule } from './applications-routing.module';
import {CommonModule} from "@angular/common";
import {FormsModule} from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import {ImageDetailComponent} from "../virtualmachines/imagedetail.component";
import {VirtualMachineComponent} from "../virtualmachines/addvm.component";
import {FlavorDetailComponent} from '../virtualmachines/flavordetail.component';
import {ClientOverviewComponent} from "../virtualmachines/vmClients.component";
import {UserinfoComponent} from "../userinfo/userinfo.component";
import {VmOverviewComponent} from "../virtualmachines/vmOverview.component";
import {AddsinglevmComponent} from "./addsinglevm.component";
import {AddcloudapplicationComponent} from "./addcloudapplication.component";

@NgModule({
  imports: [
    ApplicationsRoutingModule,
    TabsModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),


  ],
  declarations: [
    ApplicationsComponent,
      AddsinglevmComponent,
      AddcloudapplicationComponent,
  ]
})
export class ApplicationsModule { }
