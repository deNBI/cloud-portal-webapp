/**
 * Virtualmachine class.
 */
export class VirtualMachineStates {

  private static readonly _ACTIVE: string = 'ACTIVE';
  private static readonly _DELETED: string = 'DELETED';
  private static readonly _SHUTOFF: string = 'SHUTOFF';
  private static readonly _BUILD: string = 'BUILD';
  private static readonly _POWERING_OFF: string = 'POWERING OFF';
  private static readonly _NOT_FOUND: string = 'NOT FOUND';
  private static readonly _ERROR: string = 'ERROR';
  private static readonly _CLIENT_OFFLINE: string = 'CLIENT OFFLINE';
  private static readonly _RESTARTING: string = 'RESTARTING';
  private static readonly _PREPARE_PLAYBOOK_BUILD: string = 'PREPARE_PLAYBOOK_BUILD';
  private static readonly _BUILD_PLAYBOOK: string = 'BUILD_PLAYBOOK';
  private static readonly _PORT_CLOSED: string = 'PORT_CLOSED';
  private static readonly _DELETING: string = 'DELETING';
  private static readonly _DELETING_FAILED: string = 'DELETING FAILED';
  private static readonly _CHECKING_CONNECTION: string = 'CHECKING CONNECTION';

  private static readonly _GETTING_STATUS: string = 'CHECKING STATUS';

  private static readonly _IN_PROCESS_STATES: string[] = [
    VirtualMachineStates._BUILD,
    VirtualMachineStates._POWERING_OFF,
    VirtualMachineStates._RESTARTING,
    VirtualMachineStates._PREPARE_PLAYBOOK_BUILD,
    VirtualMachineStates._BUILD_PLAYBOOK,
    VirtualMachineStates._DELETING,
    VirtualMachineStates._DELETING_FAILED,
    VirtualMachineStates._CLIENT_OFFLINE,
    VirtualMachineStates._GETTING_STATUS,
    VirtualMachineStates._PORT_CLOSED,
    VirtualMachineStates._CHECKING_CONNECTION
  ];

  private static readonly _NOT_IN_PROCESS_STATES: string[] = [
    VirtualMachineStates._ACTIVE,
    VirtualMachineStates._DELETED,
    VirtualMachineStates._SHUTOFF,
    VirtualMachineStates._NOT_FOUND,
    VirtualMachineStates._ERROR
  ];

  static get BUILD(): string {
    return this._BUILD;
  }

  static get PREPARE_PLAYBOOK_BUILD(): string {
    return this._PREPARE_PLAYBOOK_BUILD;
  }

  static get BUILD_PLAYBOOK(): string {
    return this._BUILD_PLAYBOOK;
  }

  static get DELETING(): string {
    return this._DELETING;
  }

  static get ACTIVE(): string {
    return this._ACTIVE;
  }

  static get DELETED(): string {
    return this._DELETED;
  }

  static get SHUTOFF(): string {
    return this._SHUTOFF;
  }

  static get POWERING_OFF(): string {
    return this._POWERING_OFF;
  }

  static get NOT_FOUND(): string {
    return this._NOT_FOUND;
  }

  static get ERROR(): string {
    return this._ERROR;
  }

  static get CLIENT_OFFLINE(): string {
    return this._CLIENT_OFFLINE;
  }

  static get RESTARTING(): string {
    return this._RESTARTING;
  }

  static get PORT_CLOSED(): string {
    return this._PORT_CLOSED;
  }

  static get CHECKING_CONNECTION(): string {
    return this._CHECKING_CONNECTION;
  }

  static get GETTING_STATUS(): string {
    return this._GETTING_STATUS;
  }

  static get IN_PROCESS_STATES(): string[] {
    return this._IN_PROCESS_STATES;
  }

  static get NOT_IN_PROCESS_STATES(): string[] {
    return this._NOT_IN_PROCESS_STATES;
  }

  static get DELETING_FAILED(): string {
    return this._DELETING_FAILED;
  }

  public get staticDELETING(): string {
    return VirtualMachineStates.DELETING;
  }

  public get staticDELETING_FAILED(): string {
    return VirtualMachineStates.DELETING_FAILED;
  }

  public get staticPREPARE_PLAYBOOK_BUILD(): string {
    return VirtualMachineStates.PREPARE_PLAYBOOK_BUILD;
  }

  public get staticBUILD_PLAYBOOK(): string {
    return VirtualMachineStates.BUILD_PLAYBOOK;
  }

  public get staticBUILD(): string {
    return VirtualMachineStates.BUILD;
  }

   public get staticCHECKING_CONNECTION(): string {
    return VirtualMachineStates.CHECKING_CONNECTION;
  }

    public get staticPORT_CLOSED(): string {
    return VirtualMachineStates.PORT_CLOSED;
  }

  public get staticACTIVE(): string {
    return VirtualMachineStates.ACTIVE;
  }

  public get staticDELETED(): string {
    return VirtualMachineStates.DELETED;
  }

  public get staticSHUTOFF(): string {
    return VirtualMachineStates.SHUTOFF;
  }

  public get staticPOWERING_OFF(): string {
    return VirtualMachineStates.POWERING_OFF;
  }

  public get staticNOT_FOUND(): string {
    return VirtualMachineStates.NOT_FOUND;
  }

  public get staticERROR(): string {
    return VirtualMachineStates.ERROR;
  }

  public get staticCLIENT_OFFLINE(): string {
    return VirtualMachineStates.CLIENT_OFFLINE;
  }

  public get staticRESTARTING(): string {
    return VirtualMachineStates.RESTARTING;
  }

  public get staticGETTING_STATUS(): string {
    return VirtualMachineStates.GETTING_STATUS;
  }

  public get staticNOT_IN_PROCESS_STATE(): string[] {
    return VirtualMachineStates.NOT_IN_PROCESS_STATES;
  }
}
