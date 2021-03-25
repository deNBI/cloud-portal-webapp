/**
 * Project Member Application class.
 */
export class ProjectMemberApplication {

	private _Id: number;
	private _Name: string;
	private _DateCreated: string;
	private _UserIsVoMember: boolean;

	constructor(Id: number, Name: string, DateCreated: string) {
		this._Id = Id;
		this._Name = Name;
		this._DateCreated = DateCreated;

	}

	get UserIsVoMember(): boolean {
		return this._UserIsVoMember;
	}

	set UserIsVoMember(value: boolean) {
		this._UserIsVoMember = value;
	}

	get Id(): number {
		return this._Id;
	}

	set Id(value: number) {
		this._Id = value;
	}

	get Name(): string {
		return this._Name;
	}

	set Name(value: string) {
		this._Name = value;
	}

	get DateCreated(): string {
		return this._DateCreated;
	}

	set DateCreated(value: string) {
		this._DateCreated = value;
	}

}
