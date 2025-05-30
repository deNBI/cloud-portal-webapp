import { GeneralStatusStates } from '../../shared/shared_modules/baseClass/statusstates'

/**
 * Virtualmachine class.
 */
export class VirtualMachineStates extends GeneralStatusStates {
	private static readonly _ACTIVE: string = 'ACTIVE'
	private static readonly _SHUTOFF: string = 'SHUTOFF'
	private static readonly _BUILD: string = 'BUILD'
	private static readonly _POWERING_OFF: string = 'POWERING_OFF'
	private static readonly _POWERING_ON: string = 'POWERING_ON'
	private static readonly _REBOOTING: string = 'REBOOTING'
	private static readonly _REBOOTING_STARTED: string = 'REBOOT_STARTED'
	private static readonly _REBOOTING_HARD: string = 'REBOOT_STARTED_HARD'
	private static readonly _PREPARE_PLAYBOOK_BUILD: string = 'PREPARE_PLAYBOOK_BUILD'
	private static readonly _BUILD_PLAYBOOK: string = 'BUILD_PLAYBOOK'
	private static readonly _PORT_CLOSED: string = 'PORT_CLOSED'
	private static readonly _CHECKING_CONNECTION: string = 'CHECKING CONNECTION'
	private static readonly _IMAGE_PENDING_UPLOAD: string = 'IMAGE_PENDING_UPLOAD'
	private static readonly _IMAGE_UPLOADING: string = 'IMAGE_UPLOADING'
	private static readonly _SPAWNING: string = 'SPAWNING'
	private static readonly _SCHEDULING: string = 'SCHEDULING'
	private static readonly _PLANNED: string = 'PLANNED'
	private static readonly _CREATION_FAILED: string = 'CREATION_FAILED'
	private static readonly _LOCKED: string = 'LOCKED'

	private static readonly _DISABLED: string = 'DISABLED'

	private static readonly _IN_PROCESS_STATES: string[] = [
		VirtualMachineStates._REBOOTING_STARTED,
		VirtualMachineStates._REBOOTING_HARD,
		VirtualMachineStates._IMAGE_UPLOADING,
		VirtualMachineStates._IMAGE_PENDING_UPLOAD,
		VirtualMachineStates._SCHEDULING,
		VirtualMachineStates._SPAWNING,
		VirtualMachineStates._BUILD,
		VirtualMachineStates._POWERING_OFF,
		VirtualMachineStates._POWERING_ON,
		VirtualMachineStates._PREPARE_PLAYBOOK_BUILD,
		VirtualMachineStates._BUILD_PLAYBOOK,
		VirtualMachineStates._DELETING,
		// VirtualMachineStates._DELETING_FAILED,
		// VirtualMachineStates._CLIENT_OFFLINE,
		VirtualMachineStates._GETTING_STATUS,
		VirtualMachineStates._PORT_CLOSED,
		VirtualMachineStates._CHECKING_CONNECTION,
		VirtualMachineStates._GETTING_STATUS,
		VirtualMachineStates._PLANNED,

		null
	]

	private static readonly _NOT_IN_PROCESS_STATES: string[] = [
		VirtualMachineStates._ACTIVE,
		VirtualMachineStates._DELETED,
		VirtualMachineStates._SHUTOFF,
		VirtualMachineStates._NOT_FOUND,
		VirtualMachineStates._ERROR,
		VirtualMachineStates._CLIENT_OFFLINE,
		VirtualMachineStates._DELETING_FAILED,
		VirtualMachineStates._CREATION_FAILED,
		VirtualMachineStates._MIGRATED,
		VirtualMachineStates._LOCKED,
		VirtualMachineStates._DISABLED
	]

	private static readonly _DELETABLE_STATES: string[] = [
		VirtualMachineStates._ACTIVE,
		VirtualMachineStates._SHUTOFF,
		VirtualMachineStates._ERROR,
		VirtualMachineStates._PORT_CLOSED,
		VirtualMachineStates._PLANNED,
		VirtualMachineStates._PREPARE_PLAYBOOK_BUILD,
		VirtualMachineStates._CREATION_FAILED,
		VirtualMachineStates._LOCKED
	]

	static get DELETABLE_STATES(): string[] {
		return this._DELETABLE_STATES
	}

	static get CLIENT_OFFLINE(): string {
		return this._CLIENT_OFFLINE
	}

	static get DISABLED(): string {
		return this._DISABLED
	}

	static get LOCKED(): string {
		return this._LOCKED
	}

	static get REBOOTING(): string {
		return this._REBOOTING
	}

	static get REBOOTING_STARTED(): string {
		return this._REBOOTING_STARTED
	}

	static get PLANNED(): string {
		return this._PLANNED
	}

	static get REBOOTING_HARD(): string {
		return this._REBOOTING_HARD
	}

	static get BUILD(): string {
		return this._BUILD
	}

	static get IMAGE_PENDING_UPLOAD(): string {
		return this._IMAGE_PENDING_UPLOAD
	}

	static get IMAGE_UPLOADING(): string {
		return this._IMAGE_UPLOADING
	}

	static get PREPARE_PLAYBOOK_BUILD(): string {
		return this._PREPARE_PLAYBOOK_BUILD
	}

	static get BUILD_PLAYBOOK(): string {
		return this._BUILD_PLAYBOOK
	}

	static get ACTIVE(): string {
		return this._ACTIVE
	}

	static get SHUTOFF(): string {
		return this._SHUTOFF
	}

	static get SPAWNING(): string {
		return this._SPAWNING
	}

	static get SCHEDULING(): string {
		return this._SCHEDULING
	}

	static get POWERING_OFF(): string {
		return this._POWERING_OFF
	}

	static get POWERING_ON(): string {
		return this._POWERING_ON
	}

	static get PORT_CLOSED(): string {
		return this._PORT_CLOSED
	}

	static get CHECKING_CONNECTION(): string {
		return this._CHECKING_CONNECTION
	}

	static get IN_PROCESS_STATES(): string[] {
		return this._IN_PROCESS_STATES
	}

	static get NOT_IN_PROCESS_STATES(): string[] {
		return this._NOT_IN_PROCESS_STATES
	}

	static get CREATION_FAILED(): string {
		return this._CREATION_FAILED
	}

	public get staticPREPARE_PLAYBOOK_BUILD(): string {
		return VirtualMachineStates.PREPARE_PLAYBOOK_BUILD
	}

	public get staticIMAGE_UPLOADING(): string {
		return VirtualMachineStates.IMAGE_UPLOADING
	}

	public get staticDISABLED(): string {
		return VirtualMachineStates.DISABLED
	}

	public get staticIMAGE_PENDING_UPLOAD(): string {
		return VirtualMachineStates.IMAGE_PENDING_UPLOAD
	}

	public get staticBUILD_PLAYBOOK(): string {
		return VirtualMachineStates.BUILD_PLAYBOOK
	}

	public get staticBUILD(): string {
		return VirtualMachineStates.BUILD
	}

	public get staticPLANNED(): string {
		return VirtualMachineStates.PLANNED
	}

	public get staticCHECKING_CONNECTION(): string {
		return VirtualMachineStates.CHECKING_CONNECTION
	}

	public get staticPORT_CLOSED(): string {
		return VirtualMachineStates.PORT_CLOSED
	}

	public get staticACTIVE(): string {
		return VirtualMachineStates.ACTIVE
	}

	public get staticSPAWNING(): string {
		return VirtualMachineStates.SPAWNING
	}

	public get staticSCHEDULING(): string {
		return VirtualMachineStates.SCHEDULING
	}

	public get staticSHUTOFF(): string {
		return VirtualMachineStates.SHUTOFF
	}

	public get staticPOWERING_OFF(): string {
		return VirtualMachineStates.POWERING_OFF
	}

	public get staticPOWERING_ON(): string {
		return VirtualMachineStates.POWERING_ON
	}

	public get staticNOT_IN_PROCESS_STATE(): string[] {
		return VirtualMachineStates.NOT_IN_PROCESS_STATES
	}

	public get staticIN_PROCESS_STATE(): string[] {
		return VirtualMachineStates.IN_PROCESS_STATES
	}

	public get staticREBOOTING_STARTED(): string {
		return VirtualMachineStates.REBOOTING_STARTED
	}

	public get staticREBOOTING_HARD(): string {
		return VirtualMachineStates.REBOOTING_HARD
	}

	public get staticREBOOTING(): string {
		return VirtualMachineStates.REBOOTING
	}

	public get staticDELETABLE_STATES(): string[] {
		return VirtualMachineStates.DELETABLE_STATES
	}

	public get staticCREATION_FAILED(): string {
		return VirtualMachineStates.CREATION_FAILED
	}

	public get staticLOCKED(): string {
		return VirtualMachineStates.LOCKED
	}
}
