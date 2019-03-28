import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationBaseClass} from './baseClass/application-base-class';
import {ModalModule} from 'ngx-bootstrap/modal';

@NgModule({
    exports: [ApplicationBaseClass],
    imports: [
        CommonModule, ModalModule.forRoot()
    ],
    declarations: [ApplicationBaseClass]

})
export class SharedModuleModule {
}
