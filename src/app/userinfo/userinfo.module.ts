import ***REMOVED***NgModule***REMOVED*** from '@angular/core';

import ***REMOVED***TabsModule***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED***UserInfoComponent***REMOVED*** from './userinfo.component';
import ***REMOVED***UserInfoRoutingModule***REMOVED*** from './userinfo-routing.module';
import ***REMOVED***CommonModule***REMOVED*** from '@angular/common';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***ModalModule***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED***AlertModule***REMOVED*** from 'ngx-bootstrap';
import ***REMOVED***PublicKeyModule***REMOVED*** from '../shared/shared_modules/public-key/public-key.module';

@NgModule(***REMOVED***
    imports: [
        PublicKeyModule,
        UserInfoRoutingModule,
        TabsModule,
        CommonModule,
        FormsModule, ModalModule.forRoot(),
        AlertModule.forRoot()
    ],

    declarations: [
        UserInfoComponent
    ],
    exports: [UserInfoComponent, UserInfoRoutingModule, TabsModule, CommonModule, FormsModule, ModalModule, AlertModule]
***REMOVED***)
export class UserinfoModule ***REMOVED***
***REMOVED***
