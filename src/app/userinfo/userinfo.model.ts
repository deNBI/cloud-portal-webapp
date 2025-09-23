/**
 * Userinfo class.
 */
export class Userinfo {
	Id: number;
	project_application_id: number;
	FirstName: string;
	LastName: string;
	MemberId: number;
	LifeScienceId: string;
	PublicKey: string;
	UserLogin: string;
	Email: string;
	PendingEmails: string[];

	Affiliations: string[];

	MissingConsents: string[];

	constructor(userInfo?: Partial<Userinfo>) {
		Object.assign(this, userInfo);
	}

	validateAffiliations(): boolean {
		for (const affiliation of this.Affiliations) {
			if (!affiliation.includes('unknown')) {
				return true;
			}
		}

		return false;
	}
}
