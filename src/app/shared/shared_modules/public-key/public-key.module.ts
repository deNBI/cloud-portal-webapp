import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PublicKeyComponent } from './public-key.component';

/**
 * Public key module.
 */
@NgModule({
	imports: [TabsModule, CommonModule, FormsModule, ModalModule.forRoot(), AlertModule.forRoot(), NgbModule],

	declarations: [PublicKeyComponent],
	exports: [PublicKeyComponent, AlertModule, FormsModule, ModalModule, CommonModule, TabsModule],
})
export class PublicKeyModule {}
