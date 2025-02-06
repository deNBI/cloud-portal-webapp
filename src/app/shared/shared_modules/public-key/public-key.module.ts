import { NgModule } from '@angular/core'

import { TabsModule } from 'ngx-bootstrap/tabs'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { AlertModule } from 'ngx-bootstrap/alert'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { PublicKeyComponent } from './public-key.component'
import { PipeModuleModule } from '../../../pipe-module/pipe-module.module'
import { GeneratePublicKeyModalComponent } from './generate-public-key-modal/generate-public-key-modal.component'
import { SetPublicKeyModalComponent } from './set-public-key-modal/set-public-key-modal.component'

/**
 * Public key module.
 */
@NgModule({
    imports: [
        TabsModule,
        CommonModule,
        FormsModule,
        ModalModule.forRoot(),
        AlertModule.forRoot(),
        NgbModule,
        PipeModuleModule,
        PublicKeyComponent, GeneratePublicKeyModalComponent, SetPublicKeyModalComponent
    ],
    exports: [PublicKeyComponent, AlertModule, FormsModule, ModalModule, CommonModule, TabsModule]
})
export class PublicKeyModule {}
