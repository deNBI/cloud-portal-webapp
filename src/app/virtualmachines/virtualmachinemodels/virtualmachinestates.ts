import {GeneralStatusStates} from '../../shared/shared_modules/baseClass/statusstates';

/**
 * Virtualmachine class.
 */
export class VirtualMachineStates extends GeneralStatusStates {

  private static readonly _ACTIVE: string = 'ACTIVE';
  private static readonly _SHUTOFF: string = 'SHUTOFF';
  private static readonly _BUILD: string = 'BUILD';
  private static readonly _POWERING_OFF: string = 'POWERING OFF';
  private static readonly _POWERING_ON: string = 'POWERING ON';
  private static readonly _PREPARE_PLAYBOOK_BUILD: string = 'PREPARE_PLAYBOOK_BUILD';
  private static readonly _BUILD_PLAYBOOK: string = 'BUILD_PLAYBOOK';
  private static readonly _PORT_CLOSED: string = 'PORT_CLOSED';
  private static readonly _CHECKING_CONNECTION: string = 'CHECKING CONNECTION';

  private static readonly _IN_PROCESS_STATES: string[] = [
    VirtualMachineStates._BUILD,
    VirtualMachineStates._POWERING_OFF,
    VirtualMachineStates._POWERING_ON,
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

  static get ACTIVE(): string {
    return this._ACTIVE;
  }

  static get SHUTOFF(): string {
    return this._SHUTOFF;
  }

  static get POWERING_OFF(): string {
    return this._POWERING_OFF;
  }

  static get POWERING_ON(): string {
    return this._POWERING_ON;
  }



  static get PORT_CLOSED(): string {
    return this._PORT_CLOSED;
  }

  static get CHECKING_CONNECTION(): string {
    return this._CHECKING_CONNECTION;
  }

  static get IN_PROCESS_STATES(): string[] {
    return this._IN_PROCESS_STATES;
  }

  static get NOT_IN_PROCESS_STATES(): string[] {
    return this._NOT_IN_PROCESS_STATES;
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

  public get staticSHUTOFF(): string {
    return VirtualMachineStates.SHUTOFF;
  }

  public get staticPOWERING_OFF(): string {
    return VirtualMachineStates.POWERING_OFF;
  }

   public get staticPOWERING_ON(): string {
    return VirtualMachineStates.POWERING_ON;
  }


  public get staticNOT_IN_PROCESS_STATE(): string[] {
    return VirtualMachineStates.NOT_IN_PROCESS_STATES;
  }

  public get staticIN_PROCESS_STATE(): string[] {
    return VirtualMachineStates.IN_PROCESS_STATES;
  }
}
