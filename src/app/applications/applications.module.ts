import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { ApplicationsComponent } from './applications.component';
import { ApplicationsRoutingModule } from './applications-routing.module';
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    ApplicationsRoutingModule,
    TabsModule,
    CommonModule
  ],
  declarations: [
    ApplicationsComponent
  ]
})
export class ApplicationsModule { }
