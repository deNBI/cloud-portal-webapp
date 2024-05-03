import { Component, Input, OnInit } from '@angular/core';
import { Application } from '../../application.model/application.model';
import { ApplicationBaseClassComponent } from '../../../shared/shared_modules/baseClass/application-base-class.component';

/**
 * Lifetime extension details.
 */
@Component({
	selector: 'app-lifetime-extension-detail',
	templateUrl: './lifetime-extension-detail.component.html',
})
export class LifetimeExtensionDetailComponent extends ApplicationBaseClassComponent implements OnInit {
		@Input() application: Application;

		ngOnInit() {
			this.getExtensionUser(this.application);
		}
}
