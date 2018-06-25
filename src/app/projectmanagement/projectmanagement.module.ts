import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** FacilityProjectsOverviewComponent***REMOVED*** from "../facility_manager/facilityprojectsoverview.component";
import ***REMOVED*** TabsModule ***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED*** OverviewComponent ***REMOVED*** from './overview.component';
import ***REMOVED*** ProjectManagementRoutingModule ***REMOVED*** from './projectmanagement-routing.module';
import ***REMOVED***CommonModule***REMOVED*** from "@angular/common";
import ***REMOVED*** ModalModule ***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***ImageTagComponent***REMOVED*** from "../facility_manager/imagetags.component";
@NgModule(***REMOVED***
  imports: [
    ProjectManagementRoutingModule,
    TabsModule,
      FormsModule,
    CommonModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    OverviewComponent,

  ]
***REMOVED***)
export class ProjectManagementModule ***REMOVED*** ***REMOVED***
