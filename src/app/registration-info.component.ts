import {Component} from '@angular/core';
import {environment} from '../environments/environment';

@Component({
    selector: 'app-registration-info',
    templateUrl: 'registration-info.component.html'

})
export class RegistrationInfoComponent {
    voRegistrationLink = environment.voRegistrationLink;
}
