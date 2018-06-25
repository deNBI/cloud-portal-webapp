import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { VmRoutingModule } from './vm_routing.module';
import {CommonModule} from "@angular/common";
import {FormsModule} from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import {ImageDetailComponent} from "../virtualmachines/imagedetail.component";
import {VirtualMachineComponent} from "../virtualmachines/addvm.component";
import {FlavorDetailComponent} from '../virtualmachines/flavordetail.component';
import {ClientOverviewComponent} from "../virtualmachines/vmClients.component";
import {VmOverviewComponent} from "../virtualmachines/vmOverview.component";


@NgModule({
  imports: [
    VmRoutingModule,
    TabsModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),


  ],
  declarations: [
    ImageDetailComponent,
    VirtualMachineComponent,
    FlavorDetailComponent,
    ClientOverviewComponent,
    VmOverviewComponent,
  ]
})
export class VmModule { }
