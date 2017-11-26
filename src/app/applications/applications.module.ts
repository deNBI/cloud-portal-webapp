import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { ApplicationsComponent } from './applications.component';
import { AddApplicationComponent } from './addapplication.component';
import { ApplicationsRoutingModule } from './applications-routing.module';
import {CommonModule} from "@angular/common";
import {FormsModule} from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import {ImageDetailComponent} from "./imagedetail.component";
import {VirtualMachineComponent} from "./addvm.component";
import {FlavorDetailComponent} from './flavordetail.component';
import {ClientOverviewComponent} from "./vmClients.component";
import {UserinfoComponent} from "../userinfo/userinfo.component";


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
    AddApplicationComponent,
    ImageDetailComponent,
    VirtualMachineComponent,
    FlavorDetailComponent,
    ClientOverviewComponent,


  ]
})
export class ApplicationsModule { }
