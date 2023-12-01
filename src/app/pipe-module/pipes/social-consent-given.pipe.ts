import { Pipe, PipeTransform } from '@angular/core';
import { SocialConsent } from 'app/shared/shared_modules/testimonial-forms/social-consent.model';

/**
 * Generic Pipe to check if element is in list.
 */
@Pipe({
	name: 'socialConsentGiven',
})
export class SocialConsentGivenPipe implements PipeTransform {
	transform(list: SocialConsent[], value: SocialConsent): boolean {
		const idx: number = list.findIndex(consent => consent.id === value.id);
		if (idx !== -1) {
			return false;
		} else {
			return true;
		}
	}
}
