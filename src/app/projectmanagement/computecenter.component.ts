/**
 * ComputeCenter component.
 */
export class ComputecenterComponent {

	private _FacilityId: string;
	private _Name: string;
	private _Login: string;
	private _Support: string;

	constructor(FacilityId: string, Name: string, Login: string, Support: string) {
		this._FacilityId = FacilityId;
		this._Name = Name;
		this._Login = Login;
		this._Support = Support;

	}

	get FacilityId(): string {
		return this._FacilityId;
	}

	set FacilityId(value: string) {
		this._FacilityId = value;
	}

	get Name(): string {
		return this._Name;
	}

	set Name(value: string) {
		this._Name = value;
	}

	get Login(): string {
		return this._Login;
	}

	set Login(value: string) {
		this._Login = value;
	}

	get Support(): string {
		return this._Support;
	}

	set Support(value: string) {
		this._Support = value;
	}
}
