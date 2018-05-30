import { NgModule } from '@angular/core';
import { FacilityProjectsOverviewComponent} from "../facility_manager/facilityprojectsoverview.component";
import { TabsModule } from 'ngx-bootstrap/tabs';
import {CommonModule} from "@angular/common";
import { ModalModule } from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';
import {ImageTagComponent} from "../facility_manager/imagetags.component";
import {FacilitymanagerRoutingModule} from "./facilitymanager-routing.module";
@NgModule({
  imports: [
    FacilitymanagerRoutingModule,
    TabsModule,
      FormsModule,
    CommonModule,
    ModalModule.forRoot(),
  ],
  declarations: [
      FacilityProjectsOverviewComponent,
      ImageTagComponent
  ]
})
export class FacilitymanagerModule { }
