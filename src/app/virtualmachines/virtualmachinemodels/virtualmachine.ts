import {Image} from './image';
import {Flavor} from './flavor';
import {Client} from '../clients/client.model';

/**
 * Virtualmachine class.
 */
export class VirtualMachine {
  private _flavor: Flavor;
  private _image: string;
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
  private _application_id: string;
  private _showSSHCommand: boolean = false;

  get showSSHCommand(): boolean {
    return this._showSSHCommand;
  }

  set showSSHCommand(value: boolean) {
    this._showSSHCommand = value;
  }

  get application_id(): string {
    return this._application_id;
  }

  set application_id(value: string) {
    this._application_id = value;
  }

  get udp_command(): string {
    return this._udp_command;
  }

  set udp_command(value: string) {
    this._udp_command = value;
  }

  get flavor(): Flavor {
    return this._flavor;
  }

  set flavor(value: Flavor) {
    this._flavor = value;
  }

  get image(): string {
    return this._image;
  }

  set image(value: string) {
    this._image = value;
  }

  get project(): string {
    return this._project;
  }

  set project(value: string) {
    this._project = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get keyname(): string {
    return this._keyname;
  }

  set keyname(value: string) {
    this._keyname = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get client(): Client {
    return this._client;
  }

  set client(value: Client) {
    this._client = value;
  }

  get openstackid(): string {
    return this._openstackid;
  }

  set openstackid(value: string) {
    this._openstackid = value;
  }

  get created_at(): string {
    return this._created_at;
  }

  set created_at(value: string) {
    this._created_at = value;
  }

  get stopped_at(): string {
    return this._stopped_at;
  }

  set stopped_at(value: string) {
    this._stopped_at = value;
  }

  get elixir_id(): string {
    return this._elixir_id;
  }

  set elixir_id(value: string) {
    this._elixir_id = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get floating_ip(): string {
    return this._floating_ip;
  }

  set floating_ip(value: string) {
    this._floating_ip = value;
  }

  get ssh_command(): string {
    return this._ssh_command;
  }

  set ssh_command(value: string) {
    this._ssh_command = value;
  }
}
