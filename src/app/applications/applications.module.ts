import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { ApplicationsComponent } from './applications.component';
import { AddApplicationComponent } from './addapplication.component';
import { ApplicationsRoutingModule } from './applications-routing.module';
import {CommonModule} from "@angular/common";
import {FormsModule} from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    ApplicationsRoutingModule,
    TabsModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  declarations: [
    ApplicationsComponent,
    AddApplicationComponent

  ]
})
export class ApplicationsModule { }
