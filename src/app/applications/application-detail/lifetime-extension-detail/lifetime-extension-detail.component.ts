import { Component, Input } from '@angular/core';
import { Application } from '../../application.model/application.model';

/**
 * Lifetime extension details.
 */
@Component({
	selector: 'app-lifetime-extension-detail',
	templateUrl: './lifetime-extension-detail.component.html',
})
export class LifetimeExtensionDetailComponent {
  @Input() application: Application;
}
