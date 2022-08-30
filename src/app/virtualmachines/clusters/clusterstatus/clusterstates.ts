import { GeneralStatusStates } from '../../../shared/shared_modules/baseClass/statusstates';

export class Clusterstates extends GeneralStatusStates {
	private static readonly _RUNNING: string = 'Running';
	private static readonly _CREATING_: string = 'Creating';
	private static readonly _CONFIGURING: string = 'Configuring';
	private static readonly _ERROR_: string = 'Error';

	static get ERROR(): string {
		return this._ERROR_;
	}

	static get RUNNING(): string {
		return this._RUNNING;
	}

	static get CREATING(): string {
		return this._CREATING_;
	}

	static get CONFIGURING(): string {
		return this._CONFIGURING;
	}

	public get staticRUNNING(): string {
		return Clusterstates.RUNNING;
	}

	public get staticError(): string {
		return Clusterstates.ERROR;
	}

	public get staticCREATING(): string {
		return Clusterstates.CREATING;
	}

	public get staticCONFIGURING(): string {
		return Clusterstates.CONFIGURING;
	}
}
