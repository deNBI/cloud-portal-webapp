import { Component, Input } from '@angular/core';
import { Application } from '../../application.model/application.model';
import { Application_States } from '../../../shared/shared_modules/baseClass/abstract-base-class';

/**
 * Application modification details.
 */
@Component({
	selector: 'app-modification-detail',
	templateUrl: './modification-detail.component.html',
})
export class ModificationDetailComponent {
  @Input() application: Application;
  @Input() is_vo_admin: boolean;
  Application_States: typeof Application_States = Application_States;
}
