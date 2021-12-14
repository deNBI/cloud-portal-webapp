import {
	Component, DoCheck, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
	WIKI_VOLUME_OVERVIEW,
	CLOUD_PORTAL_SUPPORT_MAIL,
	STATUS_LINK,
	WIKI_EPHEMERAL_LINK,
	WIKI_MOSH_LINK,
} from 'links/links';
import { KeyValue } from '@angular/common';
import { Image } from './virtualmachinemodels/image';
import { Flavor } from './virtualmachinemodels/flavor';
import { Userinfo } from '../userinfo/userinfo.model';
import { environment } from '../../environments/environment';
import { IResponseTemplate } from '../api-connector/response-template';
import { Client } from '../vo_manager/clients/client.model';
import { VirtualMachine } from './virtualmachinemodels/virtualmachine';
import { BiocondaComponent } from './conda/bioconda.component';
import { ResEnvComponent } from './conda/res-env.component';
import { is_vo } from '../shared/globalvar';
import { RandomNameGenerator } from '../shared/randomNameGenerator';
import { Volume } from './volumes/volume';
import { UserService } from '../api-connector/user.service';
import { ImageService } from '../api-connector/image.service';
import { GroupService } from '../api-connector/group.service';
import { KeyService } from '../api-connector/key.service';
import { FlavorService } from '../api-connector/flavor.service';
import { VirtualmachineService } from '../api-connector/virtualmachine.service';
import { ApiSettings } from '../api-connector/api-settings.service';
import { BlockedImageTagResenv } from '../facility_manager/image-tag';
import { ApplicationRessourceUsage } from '../applications/application-ressource-usage/application-ressource-usage';
import { ProjectMember } from '../projectmanagement/project_member.model';
import { ApplicationsService } from '../api-connector/applications.service';

/**
 * Start virtualmachine component.
 */
@Component({
	selector: 'app-new-vm',
	templateUrl: 'addvm.component.html',
	providers: [GroupService, ImageService, KeyService, FlavorService, VirtualmachineService,
		ApiSettings, UserService, ApplicationsService],
})
export class VirtualMachineComponent implements OnInit, DoCheck, OnDestroy {

	SIXTY_SIX_PERCENT: number = 66;
	SEVENTY_FIVE: number = 75;
	ACTIVE: string = 'ACTIVE';
	DELETED: string = 'DELETED';
	PORT_CLOSED: string = 'PORT_CLOSED';
	PREPARE_PLAYBOOK_BUILD: string = 'PREPARE_PLAYBOOK_BUILD';
	CREATING_STATUS: string = 'Creating...';
	CHECKING_PORT_STATUS: string = 'Checking Connection..';
	PREPARE_PLAYBOOK_STATUS: string = 'Prepare Playbook Build...';
	ANIMATED_PROGRESS_BAR: string = 'progress-bar-animated';
	redirectProgress: string = '0';

	newVm: VirtualMachine = null;
	members_to_add: ProjectMember[] = [];
	progress_bar_status: string = 'Creating..';
	progress_bar_animated: string = 'progress-bar-animated';
	progress_bar_width: number = 0;
	http_allowed: boolean = false;
	https_allowed: boolean = false;
	udp_allowed: boolean = false;
	install_mosh: boolean = false;
	vm_responsibility: boolean = false;
	is_vo: boolean = false;
	hasTools: boolean = false;
	gaveOkay: boolean = false;
	client_checked: boolean = false;
	playbook_run: number = 0;
	timeout: number = 0;
	has_forc: boolean = false;
	WIKI_VOLUME_OVERVIEW: string = WIKI_VOLUME_OVERVIEW;
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;
	STATUS_LINK: string = STATUS_LINK;
	WIKI_EPHEMERAL_LINK: string = WIKI_EPHEMERAL_LINK;
	WIKI_MOSH_LINK: string = WIKI_MOSH_LINK;
	blockedImageTagsResenv: BlockedImageTagResenv[];

	forc_url: string = '';
	client_id: string;
	mosh_mode_available: boolean = false;
	resenvSelected: boolean = false;
	resEnvValid: boolean = true;
	resEnvNeedsName: boolean = false;
	resEnvNeedsTemplate: boolean = false;
	resEnvOkayNeeded: boolean = false;
	data_loaded: boolean = false;
	volumesToMount: Volume[] = [];
	volumesToAttach: Volume[] = [];

	title: string = 'New Instance';

	vm_name: string;

	started_machine: boolean = false;

	conda_img_path: string = 'static/webapp/assets/img/conda_logo.svg';

	singleProject: boolean = false;

	showAddVol: boolean = false;

	/**
	 * All image of a project.
	 */
	images: Image[];
	image_loaded: boolean = false;

	flavors_loaded: boolean = false;

	create_error: IResponseTemplate;

	/**
	 * All flavors of a project.
	 */
	flavors: Flavor[] = [];
	selected_flavor_types: Flavor[] = [];
	selected_flavor_type: string = 'Standard Flavors';

	flavor_types: { [name: string]: Flavor[] } = {};

	/**
	 * Selected Image.
	 */
	selectedImage: Image;

	/**
	 * Selected Flavor.
	 */
	selectedFlavor: Flavor;

	/**
	 * Userinfo from the user.
	 */
	userinfo: Userinfo;

	/**
	 * Selected Project vms client.
	 */
	selectedProjectClient: Client;

	detached_project_volumes: Volume[] = [];
	selected_detached_vol: Volume;
	undefined_detached_vol: Volume = new Volume();
	newCores: number = 0;
	newRam: number = 0;
	newVms: number = 0;
	newGpus: number = 0;
	cluster_allowed: boolean = false;
	selectedProjectRessources: ApplicationRessourceUsage;

	/**
	 * The selected project ['name',id].
	 */
	selectedProject: [string, number];

	/**
	 * If the client for a project is viable.
	 */
	client_avaiable: boolean = false;
	showAttachVol: boolean = false;
	credits_allowed: boolean = false;

	/**
	 * Default volume name.
	 *
	 * @type {string}
	 */
	volumeName: string = '';
	volumeMountPath: string;

	/**
	 * Default volumeStorage.
	 *
	 * @type {number}
	 */
	volumeStorage: number = 0;

	/**
	 * If the data for the site is initialized.
	 *
	 * @type {boolean}
	 */
	isLoaded: boolean = false;

	/**
	 * All projects of the user.
	 *
	 * @type {any[]}
	 */
	projects: [string, number][] = [];

	/**
	 * If all project data is loaded.
	 *
	 * @type {boolean}
	 */
	projectDataLoaded: boolean = false;

	/**
	 * id of the freemium project.
	 *
	 * @type {number}
	 */
	FREEMIUM_ID: number = environment.freemium_project_id;

	prod: boolean = environment.production;
	subscription: Subscription = new Subscription();

	/**
	 * Time for the check status loop.
	 *
	 * @type {number}
	 */
	private checkStatusTimeout: number = 5000;

	@ViewChild('bioconda') biocondaComponent: BiocondaComponent;
	@ViewChild('resEnv') resEnvComponent: ResEnvComponent;

	constructor(
		private groupService: GroupService,
		private imageService: ImageService,
		private flavorService: FlavorService,
		private virtualmachineservice: VirtualmachineService,
		private keyservice: KeyService,
		private userService: UserService,
		private router: Router,
	) {
		// eslint-disable-next-line no-empty-function
	}

	/**
	 * Get images for the project.
	 *
	 * @param project_id
	 */
	getImages(project_id: number): void {
		this.subscription.add(
			this.imageService.getImages(project_id).subscribe((images: Image[]): void => {
				this.images = images;
				this.image_loaded = true;
				this.checkProjectDataLoaded();
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
					this.flavor_types = this.flavorService.sortFlavors(this.flavors);
					this.flavors_loaded = true;
					this.checkProjectDataLoaded();
				},
				(error: any) => {
					console.log(error);
					this.flavors = [];
					this.flavor_types = {};
					this.flavors_loaded = true;
					this.checkProjectDataLoaded();
				},
			),
		);
	}

	getDetachedVolumesByProject(): void {
		this.subscription.add(
			this.virtualmachineservice.getDetachedVolumesByProject(this.selectedProject[1]).subscribe(
				(detached_volumes: Volume[]): void => {
					this.detached_project_volumes = detached_volumes;
				},
			),
		);
	}

	checkIfMountPathIsUsable(path?: string): boolean {
		if (path) {
			for (const vol of this.volumesToMount) {
				if (vol.volume_path === path) {
					return false;
				}
			}

			for (const vol of this.volumesToAttach) {
				if (vol.volume_path === path) {
					return false;
				}
			}

			return true;
		}

		return false;
	}

	/**
	 * Checks if the name which is entered for a new volume is valid.
	 */
	checkInputVolumeString(text?: string): boolean {
		if (text) {
			if (!(text.length > 0)) {
				return false;
			}

			// eslint-disable-next-line prefer-regex-literals
			return new RegExp('^[\\w]+$', 'i').test(text);
		}

		return false;
	}

	/**
	 * Checks if the amount of storage that is entered for a new volume is valid.
	 * Depends on free storage-space in the project and the amount of storage already 'reserved' by the volumes
	 * in the 'volumesToMount'-list.
	 */
	checkStorageNumber(): boolean {
		if (!(this.volumeStorage > 0)) {
			return false;
			// eslint-disable-next-line max-len
		} else return (this.selectedProjectRessources.used_volume_storage + this.getStorageInList() + this.volumeStorage) <= this.selectedProjectRessources.max_volume_storage;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	unsorted(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
		return 0;
	}

	/**
	 * Checks if the entered amount of storage and the entered name for a new volume are both okay.
	 * A new volume can only be added to the list, if this function returns true.
	 */
	checkVolumeValidity(): boolean {
		return (this.checkStorageNumber()
			&& this.checkIfMountPathIsUsable(this.volumeMountPath)
			&& this.checkInputVolumeString(this.volumeMountPath)
			&& this.checkInputVolumeString(this.volumeName));
	}

	/**
	 *  Adds a new volume to the list of volumes which will be mounted to the machine when it gets started.
	 */
	addVolumeToList(): void {
		const newVol: Volume = new Volume();
		newVol.volume_storage = this.volumeStorage;
		newVol.volume_name = this.volumeName;
		newVol.volume_path = this.volumeMountPath;
		newVol.volume_device = 'test';
		this.volumesToMount.push(newVol);
		this.volumeStorage = 0;
		this.volumeName = '';
		this.volumeMountPath = '';
	}

	addAttachVolume(vol: Volume): void {
		this.selected_detached_vol = this.undefined_detached_vol;
		this.volumesToAttach.push(vol);
		this.detached_project_volumes = this.detached_project_volumes.filter((volume: Volume): any => (vol !== volume));
		if (this.detached_project_volumes.length === 0) {
			this.toggleShowAttachVol();
		}
	}

	removeAttachVolume(vol: Volume): void {
		this.selected_detached_vol = null;
		const idx: number = this.volumesToAttach.indexOf(vol);
		vol.volume_path = null;
		if (idx !== -1) {
			this.volumesToAttach.splice(idx, 1);
			this.detached_project_volumes.push(vol);
		}
	}

	removeVolFromList(vol: Volume): void {
		const idx: number = this.volumesToMount.indexOf(vol);
		vol.volume_path = null;
		if (idx > -1) {
			this.volumesToMount.splice(idx, 1);
		}
	}

	/**
	 * Validate the public key of the user.
	 */
	validatePublicKey(): boolean {
		return /ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(this.userinfo.PublicKey);
	}

	/**
	 * Toggles the state of the showAddVol Boolean
	 */
	toggleShowAddVol(): void {
		if (!this.showAddVol) {
			this.showAddVol = true;
			this.showAttachVol = false;
			this.volumeName = '';
			this.volumeMountPath = null;
			this.volumeStorage = 0;
		} else {
			this.showAddVol = false;
			this.volumeName = '';
			this.volumeMountPath = null;
			this.volumeStorage = 0;
		}
	}

	toggleShowAttachVol(): void {
		if (!this.showAttachVol) {
			this.showAttachVol = true;
			this.showAddVol = false;
			this.selected_detached_vol = this.undefined_detached_vol;
		} else {
			this.showAttachVol = false;
			this.selected_detached_vol = this.undefined_detached_vol;
		}
	}

	/**
	 * Reset the progress bar.
	 */
	resetProgressBar(): void {
		this.progress_bar_status = this.CREATING_STATUS;
		this.progress_bar_animated = this.ANIMATED_PROGRESS_BAR;
		this.progress_bar_width = 0;
	}

	/**
	 * Start a virtual machine with specific params.
	 *
	 * @param flavor
	 * @param servername
	 * @param project
	 * @param projectid
	 */
	startVM(flavor: string, servername: string, project: string, projectid: string | number): void {
		this.progress_bar_width = 25;
		this.create_error = null;
		// tslint:disable-next-line:no-complex-conditionals
		if (this.selectedImage && flavor && servername && project) {
			this.create_error = null;
			this.started_machine = true;

			const re: RegExp = /\+/gi;

			const flavor_fixed: string = flavor.replace(re, '%2B');
			// Playbook and Research-Environment stuff
			let play_information: string = this.getPlaybookInformation();
			if (play_information !== '{}') {
				this.playbook_run = 1;
			} else {
				play_information = null;
			}

			if (!this.mosh_mode_available) {
				this.udp_allowed = false;
			}
			this.delay(500).then((): any => {
				this.progress_bar_width = 50;
			}).catch((): any => {
			});
			const additional_elixir_ids: string[] = this.members_to_add.map((mem: ProjectMember): string => mem.elixirId);
			this.subscription.add(
				this.virtualmachineservice.startVM(
					flavor_fixed,
					this.selectedImage,
					servername,
					project,
					projectid.toString(),
					this.http_allowed,
					this.https_allowed,
					this.udp_allowed,
					this.volumesToMount,
					this.volumesToAttach,
					play_information,
					additional_elixir_ids,
				)
					.subscribe((newVm: VirtualMachine): void => {
						this.newVm = newVm;
						this.started_machine = false;

						if (newVm.status) {
							this.progress_bar_width = 75;
							setTimeout(
								(): void => {
									void this.router.navigate(['/virtualmachines/vmOverview']).then().catch();
								},
								2000,
							);

						} else {
							this.loadProjectData();
							// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
							this.create_error = <IResponseTemplate><any>newVm;
						}

					}),
			);
		} else {
			this.progress_bar_status = this.CREATING_STATUS;
			this.newVm = null;

		}

	}

	async delay(ms: number): Promise<any> {
		// eslint-disable-next-line no-promise-executor-return
		await new Promise((resolve: any): any => setTimeout(resolve, ms));
	}

	getPlaybookInformation(): string {
		const playbook_info: {
			[name: string]: {
				[variable: string]: string
			}
		} = {};
		this.timeout = 300;
		if (this.biocondaComponent.hasChosenTools()) {
			playbook_info['bioconda'] = {
				packages: this.biocondaComponent.getChosenTools(),
			};
			this.timeout += this.biocondaComponent.getTimeout();
		}

		if (this.resEnvComponent && this.resEnvComponent.selectedTemplate.template_name !== 'undefined'
			&& this.resEnvComponent.user_key_url.errors === null) {
			playbook_info[this.resEnvComponent.selectedTemplate.template_name] = { create_only_backend: `${this.resEnvComponent.getCreateOnlyBackend()}` };
			playbook_info['user_key_url'] = { user_key_url: this.resEnvComponent.getUserKeyUrl() };
		}

		if (this.udp_allowed && this.install_mosh) {
			playbook_info['optional'] = { mosh: 'install' };
		}

		return JSON.stringify(playbook_info);
	}

	/**
	 * Get the client from the selected project.
	 * If connected geht vm,volumes etc.
	 */
	getSelectedProjectClient(): void {
		this.subscription.unsubscribe();
		this.subscription = new Subscription();
		this.subscription.add(
			this.groupService.getCreditsAllowedByPerunId(this.selectedProject[1]).subscribe((res: any): void => {
				this.credits_allowed = res['credits_allowed'];
			}),
		);
		this.newCores = 0;
		this.newGpus = 0;
		this.newVms = 0;
		this.volumesToAttach = [];
		this.volumesToMount = [];
		this.client_checked = false;
		this.projectDataLoaded = false;
		this.subscription.add(
			this.groupService.getClient(this.selectedProject[1].toString()).subscribe((client: Client): void => {
				this.loadProjectData();

				if (client.status && client.status === 'Connected' && client.activated) {
					this.client_avaiable = true;

					this.client_checked = true;
					this.getForc(client.id);
				} else {
					this.client_avaiable = false;
					this.client_checked = true;

				}
				this.selectedProjectClient = client;
				this.subscription.add(
					this.imageService.getBlockedImageTagsResenv(Number(this.selectedProjectClient.id), 'true')
						.subscribe((tags: BlockedImageTagResenv[]): void => {
							this.blockedImageTagsResenv = tags;
						}),
				);
			}),
		);
	}

	getForc(id: string): void {
		this.subscription.add(
			this.groupService.getClientForcUrl(this.selectedProject[1].toString()).subscribe((response: JSON): void => {
				if (response['forc_url'] !== null) {
					this.has_forc = true;
					this.forc_url = response['forc_url'];
				}
			}),
		);
		this.client_id = id;
	}

	/**
	 * Reset the data attribute.
	 */
	resetData(): void {
		if (this.newVm === null) {
			return;
		}
		this.newVm = null;
	}

	/**
	 * Initializes the data.
	 * Gets all groups of the user and their key.
	 */
	initializeData(): void {
		this.subscription.add(
			forkJoin([this.groupService.getSimpleVmAllowedByUser(), this.userService.getUserInfo()]).subscribe((result: any): void => {
				this.userinfo = result[1];
				this.validatePublicKey();
				const membergroups: any = result[0];
				for (const project of membergroups) {
					this.projects.push(project);

				}
				if (this.projects.length === 1) {
					this.resetChecks();
					this.selectedProject = this.projects[0];
					this.getSelectedProjectClient();
					this.singleProject = true;
				}
				this.isLoaded = true;
			}),
		);
	}

	checkProjectDataLoaded(): void {
		if (this.image_loaded && this.flavors_loaded && this.data_loaded) {
			this.generateRandomName();
			this.projectDataLoaded = true;
			this.isLoaded = true;
		}
	}

	loadProjectData(): void {
		this.projectDataLoaded = false;
		this.flavors = [];
		this.image_loaded = false;
		this.data_loaded = false;
		this.flavors_loaded = false;
		this.images = [];
		this.selectedImage = undefined;
		this.selectedFlavor = undefined;
		this.getDetachedVolumesByProject();
		this.subscription.add(
			this.groupService.getGroupResources(this.selectedProject[1].toString()).subscribe((res: ApplicationRessourceUsage): void => {
				this.selectedProjectRessources = new ApplicationRessourceUsage(res);
				this.data_loaded = true;
				this.checkProjectDataLoaded();
			}),
		);

		this.getImages(this.selectedProject[1]);
		this.getFlavors(this.selectedProject[1]);

	}

	generateRandomName(): void {
		const rng: RandomNameGenerator = new RandomNameGenerator();
		this.vm_name = rng.randomName();
	}

	setSelectedImage(image: Image): void {
		this.selectedImage = image;
		this.isMoshModeAvailable();
		this.hasImageResenv();

	}

	isMoshModeAvailable(): void {
		for (const mode of this.selectedImage.modes) {
			if (mode.name === 'MOSH') {
				this.mosh_mode_available = true;

				return;
			}
		}
		this.mosh_mode_available = false;

	}

	hasImageResenv(): void {
		if (!this.resEnvComponent) {
			return;
		}
		for (const mode of this.selectedImage.modes) {
			for (const template of this.resEnvComponent.templates) {
				if (template.template_name === mode.name) {
					this.resenvSelected = true;
					this.resEnvComponent.setOnlyNamespace(template);

					return;
				}
			}

		}
		this.resenvSelected = false;
		if (this.resEnvComponent) {
			this.resEnvComponent.unsetOnlyNamespace();
		}

	}

	setSelectedFlavor(flavor: Flavor): void {
		this.selectedFlavor = flavor;
		this.newCores = this.selectedFlavor.vcpus;
		this.newRam = this.selectedFlavor.ram;
		this.newGpus = this.selectedFlavor.gpu;
	}

	ngOnInit(): void {
		this.initializeData();
		this.is_vo = is_vo;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	ngDoCheck(): void {
		if (this.resEnvComponent) {
			this.resEnvValid = this.resEnvComponent.isValid();
			this.resEnvNeedsName = this.resEnvComponent.needsName();
			this.resEnvNeedsTemplate = this.resEnvComponent.needsTemplate();
			this.resEnvOkayNeeded = this.resEnvComponent.okayNeeded();
		}
	}

	hasChosenTools(hasSomeTools: boolean): void {
		this.hasTools = hasSomeTools;
	}

	getTimeoutMinutes(): number {
		return Math.ceil(this.timeout / 60);
	}

	resetChecks(): void {
		this.gaveOkay = false;
		this.hasTools = false;
		this.newVm = null;
		this.members_to_add = [];
		this.http_allowed = false;
		this.https_allowed = false;
		this.udp_allowed = false;
		this.install_mosh = false;
		this.vm_responsibility = false;
		this.client_checked = false;
		this.playbook_run = 0;
		this.has_forc = false;
		this.forc_url = '';
		this.mosh_mode_available = false;
		this.resenvSelected = false;
		this.resEnvValid = true;
		this.resEnvNeedsName = false;
		this.resEnvNeedsTemplate = false;
		this.resEnvOkayNeeded = false;
		this.data_loaded = false;
		this.volumesToMount = [];
		this.volumesToAttach = [];
		this.started_machine = false;
		this.showAddVol = false;
		this.images = [];
		this.image_loaded = false;
		this.flavors_loaded = false;
		this.flavors = [];
		this.selected_flavor_types = [];
		this.flavor_types = {};
		this.detached_project_volumes = [];
	}

	/**
	 * Calculates the amount of storage that is used when all volumes which are currently listed will be mounted
	 * to the machine.
	 */
	getStorageInList(): number {
		if (this.volumesToMount.length === 0) {
			return 0;
		} else {
			let storageInList: number = 0;

			this.volumesToMount.forEach((volume: Volume): void => {
				storageInList += volume.volume_storage;
			});

			return storageInList;
		}
	}

}
