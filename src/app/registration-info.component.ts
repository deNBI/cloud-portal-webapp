import { Component } from '@angular/core';
import { environment } from '../environments/environment';

/**
 * Registration info class.
 */
@Component({
	selector: 'app-registration-info',
	templateUrl: 'registration-info.component.html',

})
export class RegistrationInfoComponent {
	voRegistrationLink: string = environment.voRegistrationLink;
}
