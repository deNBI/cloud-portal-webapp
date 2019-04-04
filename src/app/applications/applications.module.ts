import ***REMOVED***NgModule***REMOVED*** from '@angular/core';

import ***REMOVED***TabsModule***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED***ApplicationsComponent***REMOVED*** from './applications.component';
import ***REMOVED***ApplicationsRoutingModule***REMOVED*** from './applications-routing.module';
import ***REMOVED***CommonModule***REMOVED*** from '@angular/common';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***ModalModule***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED***AddsinglevmComponent***REMOVED*** from './addsinglevm.component';
import ***REMOVED***AddcloudapplicationComponent***REMOVED*** from './addcloudapplication.component';
import ***REMOVED***ClickOutsideModule***REMOVED*** from 'ng4-click-outside';
import ***REMOVED*** MinAmoutValidatorDirective, MaxAmoutValidatorDirective, IntegerValidatorDirective, IntegerOrNullValidatorDirective ***REMOVED*** from './numberValidations.directive';
import ***REMOVED***ApplicationBaseClass***REMOVED*** from "../shared/shared_modules/baseClass/application-base-class";
import ***REMOVED***SharedModuleModule***REMOVED*** from "../shared/shared_modules/shared-module.module";

/**
 * Applications Module.
 */
@NgModule(***REMOVED***
    imports: [
        ApplicationsRoutingModule,
        ClickOutsideModule,
        TabsModule,
        CommonModule,
        FormsModule,
        ModalModule.forRoot()
    ],
    declarations: [
        ApplicationsComponent,
        AddsinglevmComponent,
        AddcloudapplicationComponent,
        MinAmoutValidatorDirective,
        MaxAmoutValidatorDirective,
        IntegerValidatorDirective,
        IntegerOrNullValidatorDirective
    ]
***REMOVED***)
export class ApplicationsModule ***REMOVED***
***REMOVED***
