import { Component, Input } from '@angular/core';
import { Application } from '../../application.model/application.model';

/**
 * PI/User informations
 */
@Component({
	selector: 'app-application-pi-detail',
	templateUrl: './application-pi-detail.component.html',
})
export class ApplicationPiDetailComponent {
  @Input() application: Application;
}
