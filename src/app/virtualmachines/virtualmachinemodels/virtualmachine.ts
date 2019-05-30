import ***REMOVED***Image***REMOVED*** from './image';
import ***REMOVED***Flavor***REMOVED*** from './flavor';
import ***REMOVED***Client***REMOVED*** from '../clients/client.model';

/**
 * Virtualmachine class.
 */
export class VirtualMachine ***REMOVED***
  private _flavor: Flavor;
  private _image: Image;
  private _project: string;
  private _status: string;
  private _keyname: string;
  private _name: string;
  private _client: Client;
  private _openstackid: string;
  private _created_at: string;
  private _stopped_at: string;
  private _elixir_id: string;
  private _username: string;
  private _floating_ip: string;
  private _ssh_command: string;
  private _udp_command: string;

  get udp_command(): string ***REMOVED***
    return this._udp_command;
  ***REMOVED***

  set udp_command(value: string) ***REMOVED***
    this._udp_command = value;
  ***REMOVED***

  get flavor(): Flavor ***REMOVED***
    return this._flavor;
  ***REMOVED***

  set flavor(value: Flavor) ***REMOVED***
    this._flavor = value;
  ***REMOVED***

  get image(): Image ***REMOVED***
    return this._image;
  ***REMOVED***

  set image(value: Image) ***REMOVED***
    this._image = value;
  ***REMOVED***

  get project(): string ***REMOVED***
    return this._project;
  ***REMOVED***

  set project(value: string) ***REMOVED***
    this._project = value;
  ***REMOVED***

  get status(): string ***REMOVED***
    return this._status;
  ***REMOVED***

  set status(value: string) ***REMOVED***
    this._status = value;
  ***REMOVED***

  get keyname(): string ***REMOVED***
    return this._keyname;
  ***REMOVED***

  set keyname(value: string) ***REMOVED***
    this._keyname = value;
  ***REMOVED***

  get name(): string ***REMOVED***
    return this._name;
  ***REMOVED***

  set name(value: string) ***REMOVED***
    this._name = value;
  ***REMOVED***

  get client(): Client ***REMOVED***
    return this._client;
  ***REMOVED***

  set client(value: Client) ***REMOVED***
    this._client = value;
  ***REMOVED***

  get openstackid(): string ***REMOVED***
    return this._openstackid;
  ***REMOVED***

  set openstackid(value: string) ***REMOVED***
    this._openstackid = value;
  ***REMOVED***

  get created_at(): string ***REMOVED***
    return this._created_at;
  ***REMOVED***

  set created_at(value: string) ***REMOVED***
    this._created_at = value;
  ***REMOVED***

  get stopped_at(): string ***REMOVED***
    return this._stopped_at;
  ***REMOVED***

  set stopped_at(value: string) ***REMOVED***
    this._stopped_at = value;
  ***REMOVED***

  get elixir_id(): string ***REMOVED***
    return this._elixir_id;
  ***REMOVED***

  set elixir_id(value: string) ***REMOVED***
    this._elixir_id = value;
  ***REMOVED***

  get username(): string ***REMOVED***
    return this._username;
  ***REMOVED***

  set username(value: string) ***REMOVED***
    this._username = value;
  ***REMOVED***

  get floating_ip(): string ***REMOVED***
    return this._floating_ip;
  ***REMOVED***

  set floating_ip(value: string) ***REMOVED***
    this._floating_ip = value;
  ***REMOVED***

  get ssh_command(): string ***REMOVED***
    return this._ssh_command;
  ***REMOVED***

  set ssh_command(value: string) ***REMOVED***
    this._ssh_command = value;
  ***REMOVED***
***REMOVED***
