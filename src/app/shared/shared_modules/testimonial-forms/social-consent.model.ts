/**
 * Social Consent  class.
 */
export class SocialConsent {
	id: number;
	name: string;
	description: string;

	constructor(socialConsent?: Partial<SocialConsent>) {
		Object.assign(this, socialConsent);
	}
}
