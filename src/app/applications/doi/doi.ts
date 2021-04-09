/**
 * Doi Class.
 */
export class Doi {

	private _identifier: string;
	private _id: number | string;

	get identifier(): string {
		return this._identifier;
	}

	set identifier(value: string) {
		this._identifier = value;
	}

	get id(): number | string {
		return this._id;
	}

	set id(value: number | string) {
		this._id = value;
	}
}
