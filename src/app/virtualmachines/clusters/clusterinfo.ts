import {VirtualMachine} from '../virtualmachinemodels/virtualmachine';
import {Client} from '../clients/client.model';

/**
 * Clusterinfo
 */
export class Clusterinfo {
  private _master_instance: VirtualMachine;
  private _worker_instances: VirtualMachine[];
  private _client: Client;
  private _public_ip: string;
  private _cluster_id: string;
  private _group_id: string;
  private _user: string;
  private _instances_count: number;
  private _launch_date: string;
  private _key_name: string;
  private _status: string;
  private _application_id: string;
  private _project: string;
  private _userlogin: string;
  private _master_instance_openstack_id: string;

  get master_instance_openstack_id(): string {
    return this._master_instance_openstack_id;
  }

  set master_instance_openstack_id(value: string) {
    this._master_instance_openstack_id = value;
  }

  get userlogin(): string {
    return this._userlogin;
  }

  set userlogin(value: string) {
    this._userlogin = value;
  }

  get project(): string {
    return this._project;
  }

  set project(value: string) {
    this._project = value;
  }

  get application_id(): string {
    return this._application_id;
  }

  set application_id(value: string) {
    this._application_id = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get master_instance(): VirtualMachine {
    return this._master_instance;
  }

  set master_instance(value: VirtualMachine) {
    this._master_instance = value;
    this._master_instance_openstack_id = this._master_instance.openstackid
  }

  get worker_instances(): VirtualMachine[] {
    return this._worker_instances;
  }

  set worker_instances(value: VirtualMachine[]) {
    this._worker_instances = value;
  }

  get client(): Client {
    return this._client;
  }

  set client(value: Client) {
    this._client = value;
  }

  get public_ip(): string {
    return this._public_ip;
  }

  set public_ip(value: string) {
    this._public_ip = value;
  }

  get cluster_id(): string {
    return this._cluster_id;
  }

  set cluster_id(value: string) {
    this._cluster_id = value;
  }

  get group_id(): string {
    return this._group_id;
  }

  set group_id(value: string) {
    this._group_id = value;
  }

  get user(): string {
    return this._user;
  }

  set user(value: string) {
    this._user = value;
  }

  get instances_count(): number {
    return this._instances_count;
  }

  set instances_count(value: number) {
    this._instances_count = value;
  }

  get launch_date(): string {
    return this._launch_date;
  }

  set launch_date(value: string) {
    this._launch_date = value;
  }

  get key_name(): string {
    return this._key_name;
  }

  set key_name(value: string) {
    this._key_name = value;
  }
}
