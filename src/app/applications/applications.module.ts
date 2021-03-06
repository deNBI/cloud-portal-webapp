import {NgModule} from '@angular/core';

import {TabsModule} from 'ngx-bootstrap/tabs';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {ApplicationsComponent} from './applications.component';
import {ApplicationsRoutingModule} from './applications-routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {AddsimplevmComponent} from './addsimplevm.component';
import {AddcloudapplicationComponent} from './addcloudapplication.component';
import {ClickOutsideModule} from 'ng4-click-outside';
import {TypeOverviewComponent} from './type-overview.component';
import {AppSidebarModule} from '@coreui/angular';
import {ValidationApplicationComponent} from '../validation-application/validation-application.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {ApplicationDetailComponent} from './application-detail/application-detail.component';
import {SharedDirectivesModule} from '../shared/shared_modules/shared_directives.module';
import {ApplicationFormularComponent} from './application-formular/application-formular.component';
import {PipeModuleModule} from '../pipe-module/pipe-module.module';
import { ApplicationPiDetailComponent } from './application-detail/application-pi-detail/application-pi-detail.component';
import { InformationDetailComponent } from './application-detail/information-detail/information-detail.component';
import { ResourceDetailComponent } from './application-detail/resource-detail/resource-detail.component';
import { ModificationDetailComponent } from './application-detail/modification-detail/modification-detail.component';
import { CreditsExtensionDetailComponent } from './application-detail/credits-extension-detail/credits-extension-detail.component';
import { LifetimeExtensionDetailComponent } from './application-detail/lifetime-extension-detail/lifetime-extension-detail.component';

/**
 * Applications Module.
 */
@NgModule({
            imports: [
              AccordionModule.forRoot(),
              ApplicationsRoutingModule,
              ClickOutsideModule,
              TabsModule,
              CommonModule,
              FormsModule,
              ModalModule.forRoot(),
              AppSidebarModule,
              AutocompleteLibModule,
              SharedDirectivesModule,
              PipeModuleModule
            ],
            declarations: [
              ApplicationsComponent,
              AddsimplevmComponent,
              AddcloudapplicationComponent,
              TypeOverviewComponent,
              ValidationApplicationComponent,
              ApplicationDetailComponent,
              ApplicationFormularComponent,
              ApplicationPiDetailComponent,
              InformationDetailComponent,
              ResourceDetailComponent,
              ModificationDetailComponent,
              CreditsExtensionDetailComponent,
              LifetimeExtensionDetailComponent
            ],
            exports: [ApplicationDetailComponent]
          })
export class ApplicationsModule {
}
