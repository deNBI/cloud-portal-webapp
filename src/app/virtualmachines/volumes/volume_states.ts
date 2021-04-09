import { GeneralStatusStates } from '../../shared/shared_modules/baseClass/statusstates';

/**
 * VolumeStates class.
 */
export class VolumeStates extends GeneralStatusStates {

	private static readonly _IN_USE: string = 'IN-USE';
	private static readonly _RESERVED: string = 'RESERVED';
	private static readonly _AVAILABLE: string = 'AVAILABLE';
	private static readonly _RESERVED_PLANNED_STATUS: string = 'RESERVED_PLANNED';
	private static readonly _RESERVED_ATTACHED: string = 'RESERVED_ATTACHED';
	private static readonly _DETACHING: string = 'DETACHING';
	private static readonly _ATTACHING: string = 'ATTACHING';
	private static readonly _EXTENDING: string = 'EXTENDING';

	private static readonly _IN_PROCESS_STATES: string[] = [
		VolumeStates._RESERVED, VolumeStates._DELETING, VolumeStates._DETACHING, VolumeStates._EXTENDING];

	private static readonly _NOT_IN_PROCESS_STATES: string[] = [
		VolumeStates._IN_USE, VolumeStates._AVAILABLE, VolumeStates._NOT_FOUND, VolumeStates._ERROR, VolumeStates._DELETED,
	];

	private static readonly _NO_ACTIONS: string[] = [
		VolumeStates._DETACHING,
		VolumeStates._ATTACHING,
		VolumeStates._NOT_FOUND,
		VolumeStates._DELETING,
		VolumeStates._RESERVED,
		VolumeStates._RESERVED_ATTACHED,
		VolumeStates._CREATING,
		VolumeStates._RESERVED_PLANNED_STATUS,
		VolumeStates._EXTENDING,
		VolumeStates._DELETED,
	];

	static get RESERVED_PLANNED_STATUS(): string {
		return this._RESERVED_PLANNED_STATUS;
	}

	static get RESERVED_ATTACHED(): string {
		return this._RESERVED_ATTACHED;
	}

	static get IN_USE(): string {
		return this._IN_USE;
	}

	static get RESERVED(): string {
		return this._RESERVED;
	}

	static get AVAILABLE(): string {
		return this._AVAILABLE;
	}

	static get IN_PROCESS_STATES(): string[] {
		return this._IN_PROCESS_STATES;
	}

	static get NOT_IN_PROCESS_STATES(): string[] {
		return this._NOT_IN_PROCESS_STATES;
	}

	static get DETACHING(): string {
		return this._DETACHING;
	}

	static get ATTACHING(): string {

		return this._ATTACHING;
	}

	static get NO_ACTIONS(): string[] {
		return this._NO_ACTIONS;
	}

	static get EXTENDING(): string {
		return this._EXTENDING;
	}

	public get staticRESERVED_ATTACHED(): string {
		return VolumeStates.RESERVED_ATTACHED;
	}

	public get staticNO_ACTIONS(): string[] {
		return VolumeStates.NO_ACTIONS;
	}

	public get staticRESERVED(): string {
		return VolumeStates.RESERVED;
	}

	public get staticDETACHING(): string {
		return VolumeStates.DETACHING;
	}

	public get staticATTACHING(): string {
		return VolumeStates.ATTACHING;
	}

	public get staticIN_USE(): string {
		return VolumeStates.IN_USE;
	}

	public get staticAVAILABLE(): string {
		return VolumeStates.AVAILABLE;
	}

	public get staticNOT_IN_PROCESS_STATE(): string[] {
		return VolumeStates.NOT_IN_PROCESS_STATES;
	}

	public get staticRESERVED_PLANNED(): string {
		return VolumeStates.RESERVED_PLANNED_STATUS;
	}

	public get staticEXTENDING(): string {
		return VolumeStates.EXTENDING;
	}

}
