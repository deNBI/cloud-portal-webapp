import { Component, Input } from '@angular/core';
import { Application } from '../../application.model/application.model';

/**
 * Application Resource Details.
 */
@Component({
	selector: 'app-resource-detail',
	templateUrl: './resource-detail.component.html',
})
export class ResourceDetailComponent {
  @Input() application: Application;
  @Input() is_vo_admin: boolean;
  @Input() current_credits: number;
}
