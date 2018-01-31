import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { UserinfoComponent } from './userinfo.component';
import { UserinfoRoutingModule } from './userinfo-routing.module';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    UserinfoRoutingModule,
    TabsModule,
    CommonModule,
    FormsModule
  ],
  declarations: [
    UserinfoComponent
  ]
})
export class UserinfoModule { }
