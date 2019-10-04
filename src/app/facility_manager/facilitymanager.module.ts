import {NgModule} from '@angular/core';
import {FacilityProjectsOverviewComponent} from '../facility_manager/facilityprojectsoverview.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {CommonModule} from '@angular/common';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';
import {ImageTagComponent} from '../facility_manager/imagetags.component';
import {FacilitymanagerRoutingModule} from './facilitymanager-routing.module';
import {FacilityApplicationComponent} from './facility.application.component';
import {ResourcesComponent} from './resources/resources.component';
import {ExportAsModule} from 'ngx-export-as';
import {ApplicationsModule} from '../applications/applications.module';

/**
 * Facilitymanager module.
 */
@NgModule({
            imports: [
              FacilitymanagerRoutingModule,
              TabsModule,
              FormsModule,
              CommonModule,
              ModalModule.forRoot(),
              ExportAsModule, ApplicationsModule

            ],
            declarations: [
              FacilityProjectsOverviewComponent,
              ImageTagComponent,
              FacilityApplicationComponent,
              ResourcesComponent

            ]
          })
export class FacilitymanagerModule {
}
