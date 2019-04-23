import ***REMOVED***NgModule***REMOVED*** from '@angular/core';

import ***REMOVED***TabsModule***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED***AccordionModule***REMOVED*** from 'ngx-bootstrap';
import ***REMOVED***ApplicationsComponent***REMOVED*** from './applications.component';
import ***REMOVED***ApplicationsRoutingModule***REMOVED*** from './applications-routing.module';
import ***REMOVED***CommonModule***REMOVED*** from '@angular/common';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***ModalModule***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED***AddsimplevmComponent***REMOVED*** from './addsimplevm.component';
import ***REMOVED***AddcloudapplicationComponent***REMOVED*** from './addcloudapplication.component';
import ***REMOVED***ClickOutsideModule***REMOVED*** from 'ng4-click-outside';
import ***REMOVED*** MinAmoutValidatorDirective, MaxAmoutValidatorDirective, IntegerValidatorDirective, IntegerOrNullValidatorDirective ***REMOVED*** from './numberValidations.directive';
import ***REMOVED***ApplicationBaseClass***REMOVED*** from "../shared/shared_modules/baseClass/application-base-class";
import ***REMOVED***SharedModuleModule***REMOVED*** from "../shared/shared_modules/shared-module.module";
import ***REMOVED*** TypeOverviewComponent ***REMOVED*** from './type-overview.component';
import ***REMOVED***AppSidebarModule***REMOVED*** from '@coreui/angular';
import ***REMOVED***ValidationApplicationComponent***REMOVED*** from '../validation-application/validation-application.component';

/**
 * Applications Module.
 */
@NgModule(***REMOVED***
    imports: [
        AccordionModule.forRoot(),
        ApplicationsRoutingModule,
        ClickOutsideModule,
        TabsModule,
        CommonModule,
        FormsModule,
        ModalModule.forRoot(),
        AppSidebarModule,
        //SharedModuleModule
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
***REMOVED***)
export class ApplicationsModule ***REMOVED***
***REMOVED***
