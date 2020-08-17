import {Flavor} from './flavor';
import {Client} from '../../vo_manager/clients/client.model';
import {ImageMode} from '../../facility_manager/image-tag';
import {Clusterinfo} from '../clusters/clusterinfo';
import {Volume} from '../volumes/volume';
import {VirtualMachineStates} from './virtualmachinestates';

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
  private _still_used_confirmation_requested_date: Date;
  private _stopped_at: string;
  private _elixir_id: string;
  private _userlogin: string;
  private _floating_ip: string;
  private _ssh_command: string;
  private _udp_command: string;
  private _application_id: string;
  private _cardState: number;
  private _cluster: Clusterinfo;
  private _projectid: number;
  private _res_env_url: string;
  private _modes: ImageMode[];
  private _volumes: Volume[];
  private _still_used_confirmation_requested: boolean;
  private _error_msg: string;
  private _days_running: number;


  constructor(vm: VirtualMachine) {
    this._flavor = vm.flavor;
    this._image = vm.image;
    this._project = vm.project;
    this._status = vm.status;
    this._keyname = vm.keyname;
    this._name = vm.name;
    this._client = vm.client;
    this._openstackid = vm.openstackid;
    this._created_at = vm.created_at;
    this._stopped_at = vm.stopped_at;
    this._elixir_id = vm.elixir_id;
    this._userlogin = vm.userlogin;
    this._floating_ip = vm.floating_ip;
    this._ssh_command = vm.ssh_command;
    this._udp_command = vm.udp_command;
    this._application_id = vm.application_id;
    this._cardState = vm.cardState;
    this._projectid = vm.projectid;
    this._res_env_url = vm.res_env_url;
    this._modes = vm.modes;
    this._cluster = vm.cluster;
    this._volumes = vm.volumes;
    this._still_used_confirmation_requested = vm.still_used_confirmation_requested;
    this._still_used_confirmation_requested_date = vm.still_used_confirmation_requested_date;
    this.setStatusValues()
    this.calculateCreatedAt();
    this.getTerminationStartDateString();
  }

  public getTerminationStartDateString(): string {
    if (this._still_used_confirmation_requested_date === null || this._still_used_confirmation_requested_date === undefined) {
      return '';
    }

    this._still_used_confirmation_requested_date = new Date(Date.parse(this._still_used_confirmation_requested_date.toString()));
    const term_date: Date = new Date(this._still_used_confirmation_requested_date.getTime() + (1000 * 60 * 60 * 24 * 14));

    return term_date.toLocaleDateString();

  }

  public calculateCreatedAt(): void {
    if (this.created_at !== '') {
      const date: Date = new Date(parseInt(this.created_at, 10) * 1000);

      this.days_running = Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
      this.created_at = date.toLocaleDateString();
    }
  }

  setErrorMsgWithTimeout(msg: string, timeout: number = 10000): void {
    this._error_msg = msg;
    setTimeout((): void => {
                 this._error_msg = null;
               },
               timeout);

  }


  get still_used_confirmation_requested_date(): Date {
    return this._still_used_confirmation_requested_date;
  }

  set still_used_confirmation_requested_date(value: Date) {
    this._still_used_confirmation_requested_date = value;
  }

  get days_running(): number {
    return this._days_running;
  }

  set days_running(value: number) {
    this._days_running = value;
  }

  get still_used_confirmation_requested(): boolean {
    return this._still_used_confirmation_requested;
  }

  set still_used_confirmation_requested(value: boolean) {
    this._still_used_confirmation_requested = value;
  }

  get cluster(): Clusterinfo {
    return this._cluster;
  }

  set cluster(value: Clusterinfo) {
    this._cluster = value;
  }

  get volumes(): Volume[] {
    return this._volumes;
  }

  set volumes(value: Volume[]) {
    this._volumes = value;
  }

  get projectid(): number {
    return this._projectid;
  }

  set projectid(value: number) {
    this._projectid = value;
  }

  get modes(): ImageMode[] {
    return this._modes;
  }

  set modes(value: ImageMode[]) {
    this._modes = value;
  }

  get res_env_url(): string {
    return this._res_env_url;
  }

  set res_env_url(value: string) {
    this._res_env_url = value;
  }

  get cardState(): number {
    return this._cardState;
  }

  set cardState(value: number) {
    this._cardState = value;
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

  get userlogin(): string {
    return this._userlogin;
  }

  set userlogin(value: string) {
    this._userlogin = value;
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

  get error_msg(): string {
    return this._error_msg;
  }

  set error_msg(value: string) {
    this._error_msg = value;
  }

}
