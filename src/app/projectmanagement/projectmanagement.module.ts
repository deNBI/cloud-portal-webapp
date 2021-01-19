import {NgModule} from '@angular/core';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {OverviewComponent} from './overview.component';
import {ProjectManagementRoutingModule} from './projectmanagement-routing.module';
import {CommonModule} from '@angular/common';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {ApplicationsModule} from '../applications/applications.module';
import {SharedDirectivesModule} from '../shared/shared_modules/shared_directives.module';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {ChartsModule} from 'ng2-charts';
import {ProjectOsDetailsComponent} from './project-os-details/project-os-details.component';
import {PipeModuleModule} from '../pipe-module/pipe-module.module';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ApplicationProgressComponent} from '../applications/application-progress/application-progress.component';

/**
 * Projectmanagment module.
 */
@NgModule({
    imports: [
        AccordionModule.forRoot(),
        ProjectManagementRoutingModule,
        TabsModule,
        FormsModule,
        CommonModule,
        ModalModule.forRoot(),
        ApplicationsModule,
        SharedDirectivesModule,
        ChartsModule,
        AutocompleteLibModule,
        PipeModuleModule,
        BsDropdownModule
    ],
            declarations: [
              OverviewComponent,
              ProjectOsDetailsComponent,
              ApplicationProgressComponent
            ],
            exports: [
              ProjectOsDetailsComponent
            ]
          })
export class ProjectManagementModule {
}
