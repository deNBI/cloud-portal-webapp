import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***CommonModule***REMOVED*** from '@angular/common';
import ***REMOVED***ApplicationBaseClass***REMOVED*** from './baseClass/application-base-class';
import ***REMOVED***ModalModule***REMOVED*** from 'ngx-bootstrap/modal';

@NgModule(***REMOVED***
    exports: [ApplicationBaseClass],
    imports: [
        CommonModule, ModalModule.forRoot()
    ],
    declarations: [ApplicationBaseClass]

***REMOVED***)
export class SharedModuleModule ***REMOVED***
***REMOVED***
