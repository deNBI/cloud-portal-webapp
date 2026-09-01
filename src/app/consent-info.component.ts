import { Component, ChangeDetectionStrategy } from '@angular/core'
import { environment } from '../environments/environment'

/**
 * Consent info component.
 */
@Component({
	selector: 'app-consent-info',
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: 'consent-info.component.html'
})
export class ConsentInfoComponent {
	voLoginLink: string = environment.login
}
