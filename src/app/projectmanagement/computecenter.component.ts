/**
 * ComputeCenter component.
 */
export class ComputecenterComponent {
	constructor(FacilityId: string, Name: string, Login: string, Support: string, Client?: any) {
		this._FacilityId = FacilityId;
		this._Name = Name;
		this._Login = Login;
		this._Support = Support;
		this._hasClient = Client !== undefined && Client !== null;
	}

	private _hasClient: boolean;

	get hasClient(): boolean {
		return this._hasClient;
	}

	set hasClient(value: boolean) {
		this._hasClient = value;
	}

	private _FacilityId: string;

	get FacilityId(): string {
		return this._FacilityId;
	}

	set FacilityId(value: string) {
		this._FacilityId = value;
	}

	private _Name: string;

	get Name(): string {
		return this._Name;
	}

	set Name(value: string) {
		this._Name = value;
	}

	private _Login: string;

	get Login(): string {
		return this._Login;
	}

	set Login(value: string) {
		this._Login = value;
	}

	private _Support: string;

	get Support(): string {
		return this._Support;
	}

	set Support(value: string) {
		this._Support = value;
	}
}
