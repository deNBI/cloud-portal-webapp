/**
 * GerneralStatus class.
 */
export class GeneralStatusStates {

	protected static readonly _CREATING: string = 'CREATING';
	protected static readonly _NOT_FOUND: string = 'NOT_FOUND';
	protected static readonly _DELETED: string = 'DELETED';
	protected static readonly _ERROR: string = 'ERROR';
	protected static readonly _CLIENT_OFFLINE: string = 'CLIENT_OFFLINE';
	protected static readonly _DELETING: string = 'DELETING';
	protected static readonly _DELETING_FAILED: string = 'DELETING_FAILED';
	protected static readonly _GETTING_STATUS: string = 'CHECKING_STATUS';

	static get CLIENT_OFFLINE(): string {
		return this._CLIENT_OFFLINE;
	}

	static get DELETING_FAILED(): string {
		return this._DELETING_FAILED;
	}

	static get GETTING_STATUS(): string {
		return this._GETTING_STATUS;
	}

	static get CREATING(): string {
		return this._CREATING;
	}

	static get NOT_FOUND(): string {
		return this._NOT_FOUND;
	}

	static get ERROR(): string {
		return this._ERROR;
	}

	static get DELETING(): string {
		return this._DELETING;
	}

	static get DELETED(): string {
		return this._DELETED;
	}

	public get staticCLIENT_OFFLINE(): string {
		return GeneralStatusStates.CLIENT_OFFLINE;
	}

	public get staticDELETING_FAILED(): string {
		return GeneralStatusStates.DELETING_FAILED;
	}

	public get staticGETTING_STATUS(): string {
		return GeneralStatusStates.GETTING_STATUS;
	}

	public get staticNOT_FOUND(): string {
		return GeneralStatusStates.NOT_FOUND;
	}

	public get staticERROR(): string {
		return GeneralStatusStates.ERROR;
	}

	public get staticDELETING(): string {
		return GeneralStatusStates.DELETING;
	}

	public get staticDELETED(): string {
		return GeneralStatusStates.DELETED;
	}

	public get staticCREATING(): string {
		return GeneralStatusStates.CREATING;
	}

}
