import ***REMOVED***NgModule***REMOVED*** from '@angular/core';

import ***REMOVED***TabsModule***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED***CommonModule***REMOVED*** from '@angular/common';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***ModalModule***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED***AlertModule***REMOVED*** from 'ngx-bootstrap';
import ***REMOVED***PublicKeyComponent***REMOVED*** from './public-key.component';

@NgModule(***REMOVED***
    imports: [
        TabsModule,
        CommonModule,
        FormsModule, ModalModule.forRoot(),
        AlertModule.forRoot()
    ],

    declarations: [
        PublicKeyComponent,
    ],
    exports: [PublicKeyComponent, AlertModule, FormsModule, ModalModule, CommonModule, TabsModule]
***REMOVED***)
export class PublicKeyModule ***REMOVED***
***REMOVED***
