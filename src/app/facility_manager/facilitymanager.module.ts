import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** FacilityProjectsOverviewComponent***REMOVED*** from "../facility_manager/facilityprojectsoverview.component";
import ***REMOVED*** TabsModule ***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED***CommonModule***REMOVED*** from "@angular/common";
import ***REMOVED*** ModalModule ***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***ImageTagComponent***REMOVED*** from "../facility_manager/imagetags.component";
import ***REMOVED***FacilitymanagerRoutingModule***REMOVED*** from "./facilitymanager-routing.module";
import ***REMOVED***FacilityApplicationComponent***REMOVED*** from "./facility.application.component";
import ***REMOVED*** ResourcesComponent ***REMOVED*** from './resources/resources.component';

@NgModule(***REMOVED***
  imports: [
    FacilitymanagerRoutingModule,
    TabsModule,
      FormsModule,
    CommonModule,
    ModalModule.forRoot(),
  ],
  declarations: [
      FacilityProjectsOverviewComponent,
      ImageTagComponent,
      FacilityApplicationComponent,
      ResourcesComponent
  ]
***REMOVED***)
export class FacilitymanagerModule ***REMOVED*** ***REMOVED***
