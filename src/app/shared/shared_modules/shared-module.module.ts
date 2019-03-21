import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationBaseClass} from './baseClass/application-base-class';

@NgModule({
    exports: [ApplicationBaseClass],
    imports: [
        CommonModule
    ],
    declarations: [ApplicationBaseClass]

})
export class SharedModuleModule {
}
