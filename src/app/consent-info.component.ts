import {Component} from '@angular/core';
import {environment} from '../environments/environment';

@Component({
    selector: 'app-consent-info',
    templateUrl: 'consent-info.component.html'

})
export class ConsentInfoComponent {
    voLoginLink = environment.login
}
