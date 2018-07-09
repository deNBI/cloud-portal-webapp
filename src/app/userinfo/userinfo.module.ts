import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { UserinfoComponent } from './userinfo.component';
import { UserinfoRoutingModule } from './userinfo-routing.module';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    UserinfoRoutingModule,
    TabsModule,
    CommonModule,
    FormsModule, ModalModule.forRoot(),
      AlertModule.forRoot()
  ],

  declarations: [
    UserinfoComponent,
  ]
})
export class UserinfoModule { }
