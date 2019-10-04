import {ApplicationModule, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationBaseClass} from './baseClass/application-base-class';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ApplicationDetailComponent} from '../../applications/application-detail/application-detail.component';

@NgModule({
            exports: [ApplicationBaseClass],
            imports: [
              CommonModule, ModalModule.forRoot()
            ],
            declarations: [ApplicationBaseClass]

          })
export class SharedModuleModule {
}
