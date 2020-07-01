/**
 * VolumeStates class.
 */
export class VolumeStates {

  private static readonly _IN_USE: string = 'in-use';
  private static readonly _RESERVED: string = 'reserved';
  private static readonly _AVAILABLE: string = 'available';
  private static readonly _DELETING: string = 'deleting';
  private static readonly _CREATING: string = 'creating';
  private static readonly _RESERVED_PLANNED_STATUS: string = 'reserved_planned';
  private static readonly _NOT_FOUND: string = 'NOT FOUND';
  private static readonly _DETACHING: string = 'detaching';
  private static readonly _ATTACHING: string = 'attaching';
  private static readonly _EXTENDING: string = 'extending';

  private static readonly _ERROR: string = 'error';

  private static readonly _IN_PROCESS_STATES: string[] = [
    VolumeStates._RESERVED, VolumeStates._DELETING, VolumeStates._DETACHING, VolumeStates._EXTENDING];

  private static readonly _NOT_IN_PROCESS_STATES: string[] = [
    VolumeStates._IN_USE, VolumeStates._AVAILABLE, VolumeStates._NOT_FOUND, VolumeStates._ERROR
  ];

  private static readonly _NO_ACTIONS: string[] = [
    VolumeStates._DETACHING,
    VolumeStates._ATTACHING,
    VolumeStates._NOT_FOUND,
    VolumeStates._DELETING,
    VolumeStates._RESERVED,
    VolumeStates._CREATING,
    VolumeStates._RESERVED_PLANNED_STATUS,
    VolumeStates._EXTENDING
  ];

  static get CREATING(): string {
    return this._CREATING;
  }

  static get RESERVED_PLANNED_STATUS(): string {
    return this._RESERVED_PLANNED_STATUS;
  }

  static get NOT_FOUND(): string {
    return this._NOT_FOUND;
  }

  static get ERROR(): string {
    return this._ERROR;
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

  static get DELETING(): string {
    return this._DELETING;
  }

  static get NO_ACTIONS(): string[] {
    return this._NO_ACTIONS;
  }

  static get EXTENDING(): string {
    return this._EXTENDING;
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

  public get staticNOT_FOUND(): string {
    return VolumeStates.NOT_FOUND;
  }

  public get staticERROR(): string {
    return VolumeStates.ERROR;
  }

  public get staticDELETING(): string {
    return VolumeStates.DELETING;
  }

  public get staticNOT_IN_PROCESS_STATE(): string[] {
    return VolumeStates.NOT_IN_PROCESS_STATES;
  }

  public get staticCREATING(): string {
    return VolumeStates.CREATING;
  }

  public get staticRESERVED_PLANNED(): string {
    return VolumeStates.RESERVED_PLANNED_STATUS;
  }

  public get staticEXTENDING(): string {
    return VolumeStates.EXTENDING;
  }
}
