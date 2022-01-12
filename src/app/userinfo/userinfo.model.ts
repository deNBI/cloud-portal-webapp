/**
 * Userinfo class.
 */
export class Userinfo {

	Id: number;
	project_application_id: number;
	FirstName: string;
	LastName: string;
	MemberId: number;
	ElixirId: string;
	PublicKey: string;
	UserLogin: string;
	Email: string;
	PendingEmails: string[];

	constructor(userInfo?: Partial<Userinfo>) {
		Object.assign(this, userInfo);
	}
}
