import {NgModule} from '@angular/core';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {HelpComponent} from '../help/help.component';
import {HelpRoutingModule} from './help-routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {AlertModule} from 'ngx-bootstrap';

/**
 * Help module.
 */
@NgModule({
            imports: [
              HelpRoutingModule,
              TabsModule,
              CommonModule,
              FormsModule, ModalModule.forRoot(),
              AlertModule.forRoot()
            ],

            declarations: [
              HelpComponent
            ]
          })
export class HelpModule {
}
