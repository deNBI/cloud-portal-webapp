import {NgModule} from '@angular/core';
import {FacilityProjectsOverviewComponent} from '../facility_manager/facilityprojectsoverview.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {CommonModule} from '@angular/common';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ImageTagComponent} from '../facility_manager/imagetags.component';
import {FacilitymanagerRoutingModule} from './facilitymanager-routing.module';
import {FacilityApplicationComponent} from './facility.application.component';
import {ResourcesComponent} from './resources/resources.component';
import {ExportAsModule} from 'ngx-export-as';
import {ApplicationsModule} from '../applications/applications.module';
import {NewsManagerComponent} from './newsmanagement/news-manager.component';
import {PipeModuleModule} from '../pipe-module/pipe-module.module';
import { RamfactorOverviewComponent } from './resources/ramfactor-overview/ramfactor-overview.component';
import {SharedDirectivesModule} from '../shared/shared_modules/shared_directives.module';
import { CorefactorOverviewComponent } from './resources/corefactor-overview/corefactor-overview.component';

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
                  ExportAsModule, ApplicationsModule,
                  ReactiveFormsModule, PipeModuleModule, SharedDirectivesModule

              ],
            declarations: [
              FacilityProjectsOverviewComponent,
              ImageTagComponent,
              FacilityApplicationComponent,
              ResourcesComponent,
              NewsManagerComponent,
              RamfactorOverviewComponent,
              CorefactorOverviewComponent

            ]
          })
export class FacilitymanagerModule {
}
