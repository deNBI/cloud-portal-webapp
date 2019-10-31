import {NgModule} from '@angular/core';

import {TabsModule} from 'ngx-bootstrap/tabs';
import {UserInfoComponent} from './userinfo.component';
import {UserInfoRoutingModule} from './userinfo-routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {AlertModule} from 'ngx-bootstrap';
import {PublicKeyModule} from '../shared/shared_modules/public-key/public-key.module';

/**
 * Userinfo module.
 */
@NgModule({
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
          })
export class UserinfoModule {
}
