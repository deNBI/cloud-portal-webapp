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
  private static readonly _CLIENT_OFFLINE: string = 'CLIENT OFFLINE';
  private static readonly _RESTARTING: string = 'RESTARTING';
  private static readonly _PREPARE_PLAYBOOK_BUILD: string = 'PREPARE_PLAYBOOK_BUILD';
  private static readonly _BUILD_PLAYBOOK: string = 'BUILD_PLAYBOOK';

  public get staticPREPARE_PLAYBOOK_BUILD(): string {
    return VirtualMachineStates.PREPARE_PLAYBOOK_BUILD;
  }

  public get staticBUILD_PLAYBOOK(): string {
    return VirtualMachineStates.BUILD_PLAYBOOK;
  }

  public get staticBUILD(): string {
    return VirtualMachineStates.BUILD;
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

  public get staticCLIENT_OFFLINE(): string {
    return VirtualMachineStates.CLIENT_OFFLINE;
  }

  public get staticRESTARTING(): string {
    return VirtualMachineStates.RESTARTING;
  }

  static get BUILD(): string {
    return this._BUILD;
  }

  static get PREPARE_PLAYBOOK_BUILD(): string {
    return this._PREPARE_PLAYBOOK_BUILD;
  }

  static get BUILD_PLAYBOOK(): string {
    return this._BUILD_PLAYBOOK;
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

  static get CLIENT_OFFLINE(): string {
    return this._CLIENT_OFFLINE;
  }

  static get RESTARTING(): string {
    return this._RESTARTING;
  }

}
