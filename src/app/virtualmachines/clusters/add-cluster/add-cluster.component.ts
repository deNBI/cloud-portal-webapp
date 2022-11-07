import {
		ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import {forkJoin, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {KeyValue} from '@angular/common';
import {GroupService} from '../../../api-connector/group.service';
import {ImageService} from '../../../api-connector/image.service';
import {KeyService} from '../../../api-connector/key.service';
import {FlavorService} from '../../../api-connector/flavor.service';
import {VirtualmachineService} from '../../../api-connector/virtualmachine.service';
import {ApiSettings} from '../../../api-connector/api-settings.service';
import {ClientService} from '../../../api-connector/client.service';
import {UserService} from '../../../api-connector/user.service';
import {VoService} from '../../../api-connector/vo.service';
import {Image} from '../../virtualmachinemodels/image';
import {IResponseTemplate} from '../../../api-connector/response-template';
import {Flavor} from '../../virtualmachinemodels/flavor';
import {Userinfo} from '../../../userinfo/userinfo.model';
import {Client} from '../../../vo_manager/clients/client.model';
import {BiocondaComponent} from '../../conda/bioconda.component';
import {ApplicationRessourceUsage} from '../../../applications/application-ressource-usage/application-ressource-usage';
import {WorkerBatch} from '../clusterinfo';
import {CLOUD_PORTAL_SUPPORT_MAIL, STATUS_LINK} from '../../../../links/links';
import {RandomNameGenerator} from '../../../shared/randomNameGenerator';

/**
 * Cluster Component
 */
@Component({
		selector: 'app-add-cluster',
		templateUrl: './add-cluster.component.html',
		styleUrls: ['./add-cluster.component.scss'],
		providers: [
				GroupService,
				ImageService,
				KeyService,
				FlavorService,
				VirtualmachineService,
				ApiSettings,
				KeyService,
				ClientService,
				UserService,
				VoService,
		],
})
export class AddClusterComponent implements OnInit, OnDestroy {
		is_vo: boolean = false;
		CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;
		STATUS_LINK: string = STATUS_LINK;

		client_checked: boolean = false;
		timeout: number = 0;
		title: string = 'New Cluster';

		CLUSTER_IMAGES_BLOCKLIST: string[] = ['16.04'];

		/**
		 * All image of a project.
		 */
		images: Image[];

		flavors_loaded: boolean = false;

		projects_loaded: boolean;

		userinfo_loaded: boolean;

	create_error: IResponseTemplate;
	initial_loaded: boolean = false;

		/**
		 * All flavors of a project.
		 */
		flavors: Flavor[] = [];

		flavors_usable: Flavor[] = [];
		selected_flavor_types: Flavor[] = [];
		selected_flavor_type: string = 'Standard Flavors';
		flavor_types: { [name: string]: Flavor[] } = {};
		vm_limit_reached: boolean = false;
		cores_limit_reached: boolean = false;
		ram_limit_reached: boolean = false;

		cluster_id: string;
		cluster_error: string;
		cluster_started: boolean = false;
		cluster_responsibility: boolean = false;
		initial_loaded: boolean = false;

		/**
		 * Selected Image.
		 */
		selectedImage: Image;
		selectedMasterImage: Image;
		selectedWorkerBatches: WorkerBatch[] = [new WorkerBatch(1)];
		selectedBatch: WorkerBatch = this.selectedWorkerBatches[0];

		maxWorkerInstances: number;

		singleProject: boolean = false;
		cluster_name: string = '';

		/**
		 * Selected Flavor.
		 */
		selectedMasterFlavor: Flavor;
		selectedFlavor: Flavor;
		selectedWorkerFlavorSet: boolean = false;

		workerInstancesCount: number;

		/**
		 * Userinfo from the user.
		 */
		userinfo: Userinfo;

		/**
		 * Selected Project vms client.
		 */
		selectedProjectClient: Client;

		selectedProjectRessources: ApplicationRessourceUsage;

		/**
		 * The selected project ['name',id].
		 */
		selectedProject: [string, number];

		/**
		 * If the client for a project is viable.
		 */
		client_available: boolean = false;

		/**
		 * If the data for the site is initialized.
		 *
		 * @type {boolean}
		 */

		/**
		 * All projects of the user.
		 *
		 * @type {any[]}
		 */
		projects: [string, number][] = [];

		/**
		 * All projects of the user where the user is allowed to start machines.
		 *
		 * @type {any[]}
		 */
		allowedProjects: [string, number][] = [];

		/**
		 * If all project data is loaded.
		 *
		 * @type {boolean}
		 */
		projectDataLoaded: boolean = false;

		newCores: number = 0;
		newRam: number = 0;
		newVms: number = 2;
		newGpus: number = 0;
		subscription: Subscription = new Subscription();

		@ViewChild('bioconda', {static: true}) biocondaComponent: BiocondaComponent;

	constructor(
		private groupService: GroupService,
		private imageService: ImageService,
		private flavorService: FlavorService,
		private virtualmachineservice: VirtualmachineService,
		private keyservice: KeyService,
		private userService: UserService,
		private voService: VoService,
		private router: Router,
		private cdRef: ChangeDetectorRef,
	) {
		// eslint-disable-next-line no-empty-function
	}

	calcWorkerInstancesCount(): void {
		let count: number = 0;
		this.selectedWorkerBatches.forEach((batch: WorkerBatch): void => {
			batch.valid_batch = batch.worker_count <= batch.max_worker_count && batch.worker_count > 0;
			count += batch.worker_count;
		});
		this.workerInstancesCount = count;
		this.newVms = this.workerInstancesCount + 1;
	}

	changeCount(): void {
		this.calcWorkerInstancesCount();
		this.calculateNewValues();
	}

	checkFlavorsUsableForCluster(): void {
		const used_flavors: Flavor[] = [];

		// tslint:disable-next-line:no-for-each-push
		this.selectedWorkerBatches.forEach((batch: WorkerBatch): void => {
			if (batch !== this.selectedBatch) {
				used_flavors.push(batch.flavor);
			}
		});
		const flavors_to_filter: Flavor[] = this.flavors.filter(
			(flavor: Flavor): boolean => used_flavors.indexOf(flavor) < 0,
		);
		this.flavors_usable = flavors_to_filter.filter((flav: Flavor): boolean => this.selectedProjectRessources.filterFlavorsTest(flav, this.selectedWorkerBatches));
		this.flavor_types = this.flavorService.sortFlavors(this.flavors_usable);

		this.flavors_loaded = true;
		this.initial_loaded = true;
	}

	calcMaxWorkerInstancesByFlavor(): void {
		if (this.selectedBatch.flavor) {
			this.selectedBatch.max_worker_count = this.selectedProjectRessources.calcMaxWorkerInstancesByFlavor(
				this.selectedMasterFlavor,
				this.selectedBatch,
				this.selectedWorkerBatches,
			);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	unsorted(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
		return 0;
	}

	setSelectedFlavorType(key: string): void {
		this.selected_flavor_type = key;
	}

	calculateNewValues(): void {
		let tmp_ram: number = 0;
		let tmp_cores: number = 0;
		let tmp_gpus: number = 0;
		if (this.selectedMasterFlavor) {
			tmp_ram += this.selectedMasterFlavor.ram_gib;
			tmp_cores += this.selectedMasterFlavor.vcpus;
			tmp_gpus += this.selectedMasterFlavor.gpu;
		}
		if (this.selectedWorkerBatches) {
			this.selectedWorkerBatches.forEach((batch: WorkerBatch): void => {
				if (batch.worker_count && batch.flavor) {
					tmp_ram += batch.flavor.ram_gib * batch.worker_count;
					tmp_cores += batch.flavor.vcpus * batch.worker_count;
					tmp_gpus += batch.flavor.gpu * batch.worker_count;
				}
			});
		}

		calcWorkerInstancesCount(): void {
				let count: number = 0;
				this.selectedWorkerBatches.forEach((batch: WorkerBatch): void => {
						batch.valid_batch = batch.worker_count <= batch.max_worker_count && batch.worker_count > 0;
						count += batch.worker_count;
				});
				this.images.sort((x_cord: any, y_cord: any): number => Number(x_cord.is_snapshot) - Number(y_cord.is_snapshot));
			}),
		);
	}

	/**
	 * Get flavors for the project.
	 *
	 * @param project_id
	 */
	getFlavors(project_id: number): void {
		this.subscription.add(
			this.flavorService.getFlavors(project_id).subscribe(
				(flavors: Flavor[]): void => {
					this.flavors = flavors;
					this.checkFlavorsUsableForCluster();
				},
				(error: any) => {
					console.log(error);
					this.flavors = [];
					this.flavors_usable = [];
					this.flavors_loaded = true;
					this.initial_loaded = true;
				},
			),
		);
	}

	reloadFlavors(): void {
		this.flavors_loaded = false;
		this.selectedMasterFlavor = undefined;
		this.selectedFlavor = undefined;
		this.getFlavors(this.selectedProject[1]);
	}

	/**
	 * Validate the public key of the user.
	 */
	validatePublicKey(): boolean {
		return /ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(this.userinfo.PublicKey);
	}

	resetBatches(): void {
		this.selectedWorkerBatches = [new WorkerBatch(1)];
		this.selectedBatch = this.selectedWorkerBatches[0];
		this.setBatchUsableFlavors();
	}

	setBatchUsableFlavors(): void {
		const used_flavors: Flavor[] = [];

		// tslint:disable-next-line:no-for-each-push
		this.selectedWorkerBatches.forEach((existingBatch: WorkerBatch): void => {
			if (existingBatch !== this.selectedBatch) {
				used_flavors.push(existingBatch.flavor);
			}
		});
		const flavors_to_filter: Flavor[] = this.flavors.filter(
			(flavor: Flavor): boolean => used_flavors.indexOf(flavor) < 0,
		);
		// eslint-disable-next-line max-len
		this.selectedBatch.usable_flavors = flavors_to_filter.filter((flav: Flavor): boolean => this.selectedProjectRessources.filterFlavorsTest(flav, this.selectedWorkerBatches, this.selectedMasterFlavor));
	}

	setSelectedBatch(batch: WorkerBatch): void {
		this.selectedBatch = batch;
		this.checkFlavorsUsableForCluster();
		this.setBatchUsableFlavors();
		this.calcWorkerInstancesCount();
		this.calculateNewValues();
		this.calcMaxWorkerInstancesByFlavor();
		this.setBatchUsableFlavors();
	}

	addBatch(): void {
		this.selectedWorkerFlavorSet = false;
		this.selectedBatch = null;
		const newBatch: WorkerBatch = new WorkerBatch(
			this.selectedWorkerBatches[this.selectedWorkerBatches.length - 1].index + 1,
		);
		this.selectedBatch = newBatch;
		this.selectedWorkerBatches.push(this.selectedBatch);
		this.setBatchUsableFlavors();
		this.selectedBatch.image = this.selectedMasterImage;
		this.maxWorkerInstances = null;
	}

	removeBatch(batch: WorkerBatch): void {
		const idx: number = this.selectedWorkerBatches.indexOf(batch);
		if (batch === this.selectedBatch) {
			// eslint-disable-next-line no-plusplus
			for (let i = idx; i < this.selectedWorkerBatches.length; i++) {
				this.selectedWorkerBatches[i].index -= 1;
			}
			if (idx !== 0) {
				this.selectedBatch = this.selectedWorkerBatches[idx - 1];
				this.selectedWorkerFlavorSet = true;
			} else if (idx === 0 && this.selectedWorkerBatches.length > 0) {
				this.selectedBatch = this.selectedWorkerBatches[idx + 1];
			}
		}

		this.selectedWorkerBatches.splice(idx, 1);

		this.checkFlavorsUsableForCluster();
		this.setBatchUsableFlavors();
		this.calcWorkerInstancesCount();
		this.calculateNewValues();
		this.calcMaxWorkerInstancesByFlavor();
	}

	startCluster(): void {
		const re: RegExp = /\+/gi;
		this.cluster_error = null;
		this.cluster_id = null;

		const masterFlavor: string = this.selectedMasterFlavor.name.replace(re, '%2B');

		this.subscription.add(
			this.virtualmachineservice
				.startCluster(
					masterFlavor,
					this.selectedMasterImage,
					this.selectedWorkerBatches,
					this.selectedProject[1],
					this.cluster_name,
				)
				.subscribe(
					(res: any): void => {
						if (res['status'] && res['status'] === 'mutex_locked') {
							setTimeout((): void => {
								this.startCluster();
							}, 1000);
						} else {
							this.cluster_id = res['id'];
							this.cluster_started = true;

							setTimeout((): void => {
								void this.router.navigate(['/virtualmachines/clusterOverview']).then().catch();
							}, 4000);
						}
					},
					(error: any): void => {
						console.log(error);
						if (error['error']['error']) {
							this.cluster_error = error['error']['error'];
						} else {
							this.cluster_error = error;
						}
						setTimeout((): void => {
							void this.router.navigate(['/virtualmachines/clusterOverview']).then().catch();
						}, 4000);
					},
				),
		);
	}

	/**
	 * Get the client from the selected project.
	 * If connected geht vm,volumes etc.
	 */
	getSelectedProjectClient(): void {
		this.client_checked = false;
		this.projectDataLoaded = false;

		this.subscription.unsubscribe();
		this.subscription = new Subscription();
		this.subscription.add(
			this.groupService.getClientBibigrid(this.selectedProject[1].toString()).subscribe((client: Client): void => {
				if (client.status && client.status === 'Connected') {
					this.client_available = true;

					this.loadProjectData();
					this.client_checked = true;
				} else {
					this.client_available = false;
					this.client_checked = true;
					this.projectDataLoaded = true;
				}
				this.selectedProjectClient = client;
			}),
		);
	}

	/**
	 * Initializes the data.
	 * Gets all groups of the user and their key.
	 */
	initializeData(): void {
		this.subscription.add(
			forkJoin([
				this.groupService.getSimpleVmAllowedByUserWithClusterAllowed(),
				this.groupService.getSimpleVmByUserWithClusterAllowed(),
				this.userService.getUserInfo(),
			]).subscribe((result: any): void => {
				this.userinfo = result[2];
				this.userinfo_loaded = true;
				this.validatePublicKey();
				const allowedMemberGroups: any = result[0];
				const membergroups: any = result[1];
				for (const project of membergroups) {
					this.projects.push(project);
				}
				for (const project of allowedMemberGroups) {
					this.allowedProjects.push(project);
				}
				this.projects_loaded = true;
				if (this.projects.length === 1) {
					this.selectedProject = this.projects[0];
					this.singleProject = true;
					this.getSelectedProjectClient();
				}
			}),
		);
	}

	loadProjectData(): void {
		this.initial_loaded = false;
		this.projectDataLoaded = false;
		this.flavors = [];
		this.flavors_loaded = false;
		this.images = [];
		this.selectedImage = undefined;
		this.selectedFlavor = undefined;
		this.getImages(this.selectedProject[1]);
		this.subscription.add(
			this.groupService
				.getGroupResources(this.selectedProject[1].toString())
				.subscribe((res: ApplicationRessourceUsage): void => {
					this.selectedProjectRessources = new ApplicationRessourceUsage(res);
					this.getFlavors(this.selectedProject[1]);
					this.checkResources();
					this.projectDataLoaded = true;
				}),
		);
	}

	checkResources(): void {
		this.newCores = 0;
		this.newRam = 0;
		this.newVms = 2;
		this.newGpus = 0;
		this.vm_limit_reached = this.selectedProjectRessources.used_vms + 2 > this.selectedProjectRessources.number_vms;
		this.cores_limit_reached = this.selectedProjectRessources.cores_used >= this.selectedProjectRessources.cores_total;
		this.ram_limit_reached = this.selectedProjectRessources.ram_used >= this.selectedProjectRessources.ram_total;
	}

	resizeFix(): void {
		window.dispatchEvent(new Event('resize'));
	}

	ngOnInit(): void {
		this.initializeData();
		this.generateRandomName();
		this.subscription.add(
			this.voService.isVo().subscribe((result: IResponseTemplate): void => {
				this.is_vo = result.value as boolean;
			}),
		);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	setMasterFlavor(flavor: Flavor): void {
		this.selectedMasterFlavor = flavor;
		this.checkImageAgain();
	}

	checkImageAgain(): void {
		if (this.selectedMasterImage !== undefined) {
			if (this.selectedMasterImage.min_disk > 0) {
				if (this.selectedMasterFlavor.rootdisk < this.selectedMasterImage.min_disk) {
					this.selectedMasterImage = undefined;
				}
			}
		}
}
