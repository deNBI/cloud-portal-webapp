/**
 * Clientclass
 */
export class Client ***REMOVED***
  private _id: string;
  private _host: string;
  private _status: string;
  private _port: string;
  private _version: string;
  private _features: string[];
  private _maxVolumes: number;
  private _assignedVolumes: number;
  private _maxVMs: number;
  private _assignedVMs: number;
  private _location: string;
  private _maxVolumeLimit: number;
  private _assignedVolumesStorage: number;
  private _newVolumes: number;
  private _newVms: number;
  private _newVolumeLimit: number;

  constructor(host: string, port: string, location: string, id: string) ***REMOVED***
    this._host = host;
    this._port = port;
    this._location = location;
    this._id = id;
  ***REMOVED***

  get newVolumes(): number ***REMOVED***
    return this._newVolumes;
  ***REMOVED***

  set newVolumes(value: number) ***REMOVED***
    this._newVolumes = value;
  ***REMOVED***

  get newVms(): number ***REMOVED***
    return this._newVms;
  ***REMOVED***

  set newVms(value: number) ***REMOVED***
    this._newVms = value;
  ***REMOVED***

  get newVolumeLimit(): number ***REMOVED***
    return this._newVolumeLimit;
  ***REMOVED***

  set newVolumeLimit(value: number) ***REMOVED***
    this._newVolumeLimit = value;
  ***REMOVED***

  get id(): string ***REMOVED***
    return this._id;
  ***REMOVED***

  set id(value: string) ***REMOVED***
    this._id = value;
  ***REMOVED***

  get host(): string ***REMOVED***
    return this._host;
  ***REMOVED***

  set host(value: string) ***REMOVED***
    this._host = value;
  ***REMOVED***

  get status(): string ***REMOVED***
    return this._status;
  ***REMOVED***

  set status(value: string) ***REMOVED***
    this._status = value;
  ***REMOVED***

  get port(): string ***REMOVED***
    return this._port;
  ***REMOVED***

  set port(value: string) ***REMOVED***
    this._port = value;
  ***REMOVED***

  get version(): string ***REMOVED***
    return this._version;
  ***REMOVED***

  set version(value: string) ***REMOVED***
    this._version = value;
  ***REMOVED***

  get features(): string[] ***REMOVED***
    return this._features;
  ***REMOVED***

  set features(value: string[]) ***REMOVED***
    this._features = value;
  ***REMOVED***

  get maxVolumes(): number ***REMOVED***
    return this._maxVolumes;
  ***REMOVED***

  set maxVolumes(value: number) ***REMOVED***
    this._maxVolumes = value;
  ***REMOVED***

  get assignedVolumes(): number ***REMOVED***
    return this._assignedVolumes;
  ***REMOVED***

  set assignedVolumes(value: number) ***REMOVED***
    this._assignedVolumes = value;
  ***REMOVED***

  get maxVMs(): number ***REMOVED***
    return this._maxVMs;
  ***REMOVED***

  set maxVMs(value: number) ***REMOVED***
    this._maxVMs = value;
  ***REMOVED***

  get assignedVMs(): number ***REMOVED***
    return this._assignedVMs;
  ***REMOVED***

  set assignedVMs(value: number) ***REMOVED***
    this._assignedVMs = value;
  ***REMOVED***

  get location(): string ***REMOVED***
    return this._location;
  ***REMOVED***

  set location(value: string) ***REMOVED***
    this._location = value;
  ***REMOVED***

  get maxVolumeLimit(): number ***REMOVED***
    return this._maxVolumeLimit;
  ***REMOVED***

  set maxVolumeLimit(value: number) ***REMOVED***
    this._maxVolumeLimit = value;
  ***REMOVED***

  get assignedVolumesStorage(): number ***REMOVED***
    return this._assignedVolumesStorage;
  ***REMOVED***

  set assignedVolumesStorage(value: number) ***REMOVED***
    this._assignedVolumesStorage = value;
  ***REMOVED***
***REMOVED***
