import {NgModule} from '@angular/core';

import {TabsModule} from 'ngx-bootstrap/tabs';
import {AccordionModule} from 'ngx-bootstrap';
import {ApplicationsComponent} from './applications.component';
import {ApplicationsRoutingModule} from './applications-routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {AddsimplevmComponent} from './addsimplevm.component';
import {AddcloudapplicationComponent} from './addcloudapplication.component';
import {ClickOutsideModule} from 'ng4-click-outside';
import {
  MinAmoutValidatorDirective,
  MaxAmoutValidatorDirective,
  IntegerValidatorDirective,
  IntegerOrNullValidatorDirective
} from './numberValidations.directive';
import {TypeOverviewComponent} from './type-overview.component';
import {AppSidebarModule} from '@coreui/angular';
import {ValidationApplicationComponent} from '../validation-application/validation-application.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

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
              AutocompleteLibModule
            ],
            declarations: [
              ApplicationsComponent,
              AddsimplevmComponent,
              AddcloudapplicationComponent,
              MinAmoutValidatorDirective,
              MaxAmoutValidatorDirective,
              IntegerValidatorDirective,
              IntegerOrNullValidatorDirective,
              TypeOverviewComponent,
              ValidationApplicationComponent
            ]
          })
export class ApplicationsModule {
}
