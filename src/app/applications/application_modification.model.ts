import { Flavor } from '../virtualmachines/virtualmachinemodels/flavor';
import { User } from './application.model/user.model';
import { Application } from './application.model/application.model';

/**
 * Application Extension class.
 */
export class ApplicationModification {
	Id: number;
	project_application_id: number | string;
	vms_requested: number;
	volume_limit: number;
	volume_counter: number;
	object_storage: number;
	comment: string = '';
	date_submitted: string;
	total_cores: number;
	total_ram: number;
	total_gpu: number = 0;
	extra_credits: number = 0;
	user: User;
	flavors: Flavor[] = [];
	cloud_service_develop: boolean = false;
	cloud_service_user_number: number;

	constructor(extension?: Partial<ApplicationModification>) {
		Object.assign(this, extension);
		if (extension) {
			this.extra_credits = Math.round(extension.extra_credits * 10) / 10;
			if (extension.total_gpu) {
				this.total_gpu = extension.total_gpu;
			} else {
				this.total_gpu = this.calculateGpuOnly(extension.flavors);
			}
			if (extension.flavors) {
				this.flavors = [];
				for (const flavor of extension.flavors) {
					this.flavors.push(new Flavor(flavor));
				}
			}
		}
	}

	public setByApp(app: Application): void {
		this.project_application_id = app.project_application_id;
		this.volume_counter = app.project_application_volume_counter;
		this.volume_limit = app.project_application_volume_limit;
		if (app.project_application_openstack_project) {
			this.object_storage = app.project_application_object_storage;
			this.cloud_service_develop = app.project_application_cloud_service_develop;
		}
		this.flavors = [];
		for (const flavor of app.flavors) {
			this.flavors.push(new Flavor(flavor));
		}
		this.total_gpu = app.project_application_total_gpu;
		this.total_cores = app.project_application_total_cores;
		this.total_ram = app.project_application_total_ram;
	}

	public calculateGpuOnly(flavors: Flavor[]): number {
		let total_gpus: number = 0;
		for (const flavor of flavors) {
			total_gpus += flavor.gpu * flavor.counter;
		}

		return total_gpus;
	}

	public calculateRamCores(): void {
		let ram: number = 0;
		let cores: number = 0;
		let gpu: number = 0;
		for (const flavor of this.flavors) {
			ram += flavor.ram_gib * flavor.counter;
			cores += flavor.vcpus * flavor.counter;
			gpu += flavor.gpu * flavor.counter;
		}
		this.total_cores = cores;
		this.total_ram = ram;
		this.total_gpu = gpu;
	}

	public getFlavorCounter(flavor_to_test: Flavor): number {
		if (this.flavors) {
			for (const flavor of this.flavors) {
				if (flavor.name === flavor_to_test.name) {
					return flavor.counter;
				}
			}

			return 0;
		} else return 0;
	}

	public setFlavorInFlavors(flavor_param: Flavor, counter: number): void {
		const idx: number = this.flavors.findIndex((fl: Flavor): boolean => fl.name === flavor_param.name);
		if (idx !== -1) {
			if (counter > 0) {
				this.flavors[idx].counter = counter;
			} else {
				this.flavors.splice(idx, 1);
			}
		} else if (counter > 0) {
			const flavor: Flavor = flavor_param;
			flavor.counter = counter;
			this.flavors.push(flavor);
		}
		this.calculateRamCores();
	}
}
