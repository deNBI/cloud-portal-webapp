import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationBaseClassComponent} from './baseClass/application-base-class.component';
import {ModalModule} from 'ngx-bootstrap/modal';

/**
 * Shared module.
 */
@NgModule({
            exports: [ApplicationBaseClassComponent],
            imports: [
              CommonModule, ModalModule.forRoot()
            ],
            declarations: [ApplicationBaseClassComponent]

          })
export class SharedModuleModule {
}
