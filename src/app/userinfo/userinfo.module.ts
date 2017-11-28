import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { UserinfoComponent } from './userinfo.component';
import { UserinfoRoutingModule } from './userinfo-routing.module';
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    UserinfoRoutingModule,
    TabsModule,
    CommonModule
  ],
  declarations: [
    UserinfoComponent
  ]
})
export class UserinfoModule { }
