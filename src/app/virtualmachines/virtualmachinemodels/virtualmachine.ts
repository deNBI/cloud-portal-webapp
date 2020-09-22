import {Flavor} from './flavor';
import {Client} from '../../vo_manager/clients/client.model';
import {ImageMode} from '../../facility_manager/image-tag';
import {Clusterinfo} from '../clusters/clusterinfo';
import {Volume} from '../volumes/volume';

/**
 * Virtualmachine class.
 */
export class VirtualMachine {

  flavor: Flavor;
  image: string;
  project: string;
  status: string;
  keyname: string;
  name: string;
  client: Client;
  openstackid: string;
  created_at: string;
  still_used_confirmation_requested_date: Date;
  stopped_at: string;
  elixir_id: string;
  fixed_ip: string;
  userlogin: string;
  floating_ip: string;
  ssh_command: string;
  udp_command: string;
  application_id: string;
  cardState: number;
  cluster: Clusterinfo;
  projectid: number;
  res_env_url: string;
  modes: ImageMode[];
  volumes: Volume[];
  still_used_confirmation_requested: boolean;
  error_msg: string;
  days_running: number;

  constructor(vm: VirtualMachine) {
    this.flavor = vm.flavor;
    this.image = vm.image;
    this.project = vm.project;
    this.status = vm.status;
    this.keyname = vm.keyname;
    this.name = vm.name;
    this.client = vm.client;
    this.openstackid = vm.openstackid;
    this.created_at = vm.created_at;
    this.stopped_at = vm.stopped_at;
    this.elixir_id = vm.elixir_id;
    this.userlogin = vm.userlogin;
    this.floating_ip = vm.floating_ip;
    this.ssh_command = vm.ssh_command;
    this.udp_command = vm.udp_command;
    this.application_id = vm.application_id;
    this.cardState = vm.cardState;
    this.projectid = vm.projectid;
    this.res_env_url = vm.res_env_url;
    this.modes = vm.modes;
    this.fixed_ip=vm.fixed_ip;
    this.cluster = vm.cluster;
    this.volumes = vm.volumes;
    this.still_used_confirmation_requested = vm.still_used_confirmation_requested;
    this.still_used_confirmation_requested_date = vm.still_used_confirmation_requested_date;
    this.calculateCreatedAt();
    this.getTerminationStartDateString();
  }

  public getTerminationStartDateString(): string {
    if (this.still_used_confirmation_requested_date === null || this.still_used_confirmation_requested_date === undefined) {
      return '';
    }

    this.still_used_confirmation_requested_date = new Date(Date.parse(this.still_used_confirmation_requested_date.toString()));
    const term_date: Date = new Date(this.still_used_confirmation_requested_date.getTime() + (1000 * 60 * 60 * 24 * 14));

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
    this.error_msg = msg;
    setTimeout((): void => {
                 this.error_msg = null;
               },
               timeout);

  }

}
