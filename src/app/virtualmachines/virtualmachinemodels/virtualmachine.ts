import { Flavor } from './flavor';
import { Client } from '../../vo_manager/clients/client.model';
import { ImageMode } from '../../facility_manager/image-tag';
import { Clusterinfo } from '../clusters/clusterinfo';
import { Volume } from '../volumes/volume';
import { Backend } from '../conda/backend/backend';
import { CondaPackage } from '../condaPackage.model';

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
	created_at_date: string;
	deleted_at_date: string;
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
	playbook_successful: boolean = null;
	res_env_url: string;
	modes: ImageMode[];
	volumes: Volume[];
	still_used_confirmation_requested: boolean;
	error_msg: string;
	days_running: number;
	backend: Backend;
	conda_packages: CondaPackage[] = [];

	constructor(vm?: Partial<VirtualMachine>) {
		Object.assign(this, vm);
		if (vm) {
			this.flavor = new Flavor(vm.flavor);
			this.client = new Client(vm.client);
			this.cluster = new Clusterinfo(vm.cluster);
			this.volumes = [];
			for (const volume of vm.volumes) {
				this.volumes.push(new Volume(volume));
			}
			this.backend = new Backend(vm.backend);
			this.conda_packages = [];
			for (const conda_package of vm.conda_packages) {
				this.conda_packages.push(new CondaPackage(conda_package));
			}
		}
		this.getTerminationStartDateString();
		if (this.days_running == null) {
			this.days_running = this.calculateDaysRunning();
		}
	}

	public calculateDaysRunning(): number {
		const createdDate: Date = new Date(this.created_at_date);

		return Math.floor((Date.now() - createdDate.getTime()) / 86400000);

	}

	public getTerminationStartDateString(): string {
		if (this.still_used_confirmation_requested_date === null || this.still_used_confirmation_requested_date === undefined) {
			return '';
		}

		this.still_used_confirmation_requested_date = new Date(Date.parse(this.still_used_confirmation_requested_date.toString()));
		const term_date: Date = new Date(this.still_used_confirmation_requested_date.getTime() + (1000 * 60 * 60 * 24 * 14));

		return term_date.toLocaleDateString();

	}

	setErrorMsgWithTimeout(msg: string, timeout: number = 10000): void {
		this.error_msg = msg;
		setTimeout((): void => {
			this.error_msg = null;
		}, timeout);
	}

}
