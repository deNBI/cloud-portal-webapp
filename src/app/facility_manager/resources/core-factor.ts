import ***REMOVED***ComputecenterComponent***REMOVED*** from '../../projectmanagement/computecenter.component';

/**
 * CoreFactor class.
 */
export class CoreFactor ***REMOVED***

  private _id: string;
  private _factor: number;
  private _cores: number;
  private _compute_center: ComputecenterComponent;
  private _description: string;

  constructor(factor: number, cores: number, compute_center: ComputecenterComponent, description: string) ***REMOVED***
    this._factor = factor;
    this._cores = cores;
    this._compute_center = compute_center;
    this._description = description;
  ***REMOVED***

  get description(): string ***REMOVED***
    return this._description;
  ***REMOVED***

  set description(value: string) ***REMOVED***
    this._description = value;
  ***REMOVED***

  get id(): string ***REMOVED***
    return this._id;
  ***REMOVED***

  set id(value: string) ***REMOVED***
    this._id = value;
  ***REMOVED***

  get factor(): number ***REMOVED***
    return this._factor;
  ***REMOVED***

  set factor(value: number) ***REMOVED***
    this._factor = value;
  ***REMOVED***

  get cores(): number ***REMOVED***
    return this._cores;
  ***REMOVED***

  set cores(value: number) ***REMOVED***
    this._cores = value;
  ***REMOVED***

  get compute_center(): ComputecenterComponent ***REMOVED***
    return this._compute_center;
  ***REMOVED***

  set compute_center(value: ComputecenterComponent) ***REMOVED***
    this._compute_center = value;
  ***REMOVED***
***REMOVED***
