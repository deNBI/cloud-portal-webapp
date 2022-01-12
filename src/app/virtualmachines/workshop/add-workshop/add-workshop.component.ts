import {
	Component, DoCheck, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { KeyValue } from '@angular/common';
import transliterate from '@sindresorhus/transliterate';
import { Router } from '@angular/router';
import { Workshop } from '../workshop.model';
import { Userinfo } from '../../../userinfo/userinfo.model';
import { GroupService } from '../../../api-connector/group.service';
import { Client } from '../../../vo_manager/clients/client.model';
import { BlockedImageTagResenv } from '../../../facility_manager/image-tag';
import { ImageService } from '../../../api-connector/image.service';
import { ApplicationRessourceUsage } from '../../../applications/application-ressource-usage/application-ressource-usage';
import { Flavor } from '../../virtualmachinemodels/flavor';
import { Image } from '../../virtualmachinemodels/image';
import { FlavorService } from '../../../api-connector/flavor.service';
import { UserService } from '../../../api-connector/user.service';
import { ResEnvComponent } from '../../conda/res-env.component';
import { ProjectMember } from '../../../projectmanagement/project_member.model';
import {
	CLOUD_PORTAL_SUPPORT_MAIL, STATUS_LINK, WIKI_WORKSHOPS, WIKI_EPHEMERAL_LINK,
} from '../../../../links/links';
import { VirtualmachineService } from '../../../api-connector/virtualmachine.service';
import { WorkshopService } from '../../../api-connector/workshop.service';

@Component({
	selector: 'app-add-workshop',
	templateUrl: './add-workshop.component.html',
	styleUrls: ['./add-workshop.component.scss'],
	providers: [GroupService, ImageService, FlavorService, UserService, VirtualmachineService,
		WorkshopService],
})
export class AddWorkshopComponent implements OnInit, OnDestroy, DoCheck {

	title: string = 'New workshop VMs';

	WIKI_WORKSHOPS: string = WIKI_WORKSHOPS;
	STATUS_LINK: string = STATUS_LINK;
	WIKI_EPHEMERAL_LINK: string = WIKI_EPHEMERAL_LINK;

	/**
	 * The selected workshop.
	 */
	selected_workshop: Workshop;
	/**
	 * List of all workshops.
	 */
	workshops: Workshop[] = [];
	/**
	 * If all needed data is loaded.
	 */
	is_loaded: boolean = false;
	/**
	 * Userinfo of the user who wants to start a workshop.
	 */
	userinfo: Userinfo;
	/**
	 * All simplevm application with workshop set to true where user is admin.
	 */
	projects: [string, number][] = [];
	/**
	 * Selected Application for workshops.
	 */
	selected_project: [string, number];
	/**
	 * Subscription object.
	 */
	subscription: Subscription = new Subscription();
	/**
	 * If the client for a project is viable.
	 */
	client_available: boolean = false;
	/**
	 * If all project data is loaded.
	 */
	@ViewChild('res_env') res_env_component: ResEnvComponent;
	resenv_selected: boolean = false;
	res_env_valid: boolean = true;
	res_env_needs_template: boolean = false;
	res_env_okay_needed: boolean = false;
	gave_okay: boolean = false;
	project_data_loaded: boolean = false;
	credits_allowed: boolean = false;
	new_cores: number = 0;
	new_ram: number = 0;
	new_gpus: number = 0;
	new_vms: number = 0;
	client_checked: boolean = false;
	selected_project_client: Client;
	blocked_image_tags_resenv: BlockedImageTagResenv[];
	has_forc: boolean = false;
	forc_url: string = '';
	flavors: Flavor[] = [];
	selected_flavor: Flavor = undefined;
	flavors_loaded: boolean = false;
	images: Image[] = [];
	selected_image: Image = undefined;
	image_loaded: boolean = false;
	data_loaded: boolean = false;
	selected_project_ressources: ApplicationRessourceUsage;
	selected_flavor_type: string = 'Standard Flavors';
	flavor_types: { [name: string]: Flavor[] } = {};
	workshop_data_loaded: boolean = false;
	members_to_add: ProjectMember[] = [];
	project_members: ProjectMember[] = [];
	member_data_loaded: boolean = false;
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;
	vm_responsibility: boolean = false;
	started_machine: boolean = false;
	progress_bar_animated: string = 'progress-bar-animated';
	progress_bar_width: number = 0;

	constructor(
private group_service: GroupService,
							private image_service: ImageService,
							private flavor_service: FlavorService,
							private user_service: UserService,
							private virtual_machine_service: VirtualmachineService,
							private workshop_service: WorkshopService,
							private router: Router,
	) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.get_applications();
		this.get_user_data();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	ngDoCheck(): void {
		if (this.res_env_component) {
			this.res_env_valid = this.res_env_component.isValid();
			this.res_env_needs_template = this.res_env_component.needsTemplate();
			this.res_env_okay_needed = this.res_env_component.okayNeeded();
		}
	}

	get_applications(): void {
		this.projects = [];
		this.subscription.add(
			this.group_service.getSimpleVmByUserWhereWorkshopAndAdmin().subscribe(
				(projects: any) => {
					for (const project of projects) {
						this.projects.push(project);
					}
					this.is_loaded = true;
				},
			),
		);
	}

	get_user_data(): void {
		this.subscription.add(
			this.user_service.getUserInfo().subscribe(
				(result: Userinfo) => {
					this.userinfo = result;
				},
			),
		);
	}

	get_members_of_the_project(): void {
		this.subscription.add(
			this.group_service.getGroupMembers(this.selected_project[1].toString()).subscribe(
				(members: ProjectMember[]): void => {
					this.project_members = members;
					this.member_data_loaded = true;
					this.check_project_data_loaded();
				},
			),
		);
	}

	get_selected_project_client(): void {
		this.subscription.add(
			this.group_service.getCreditsAllowedByPerunId(this.selected_project[1]).subscribe((res: any): void => {
				this.credits_allowed = res['credits_allowed'];
			}),
		);

		this.subscription.add(
			this.group_service.getClient(this.selected_project[1].toString()).subscribe((client: Client): void => {
				this.load_project_data();
				if (client.status && client.status === 'Connected' && client.activated) {
					this.client_available = true;
					this.client_checked = true;
					this.get_forc();
				} else {
					this.client_available = false;
					this.client_checked = true;
				}
				this.selected_project_client = client;
				this.subscription.add(
					this.image_service.getBlockedImageTagsResenv(Number(this.selected_project_client.id), 'true')
						.subscribe((tags: BlockedImageTagResenv[]): void => {
							this.blocked_image_tags_resenv = tags;
						}),
				);
			}),
		);
	}

	get_workshops_for_application(): void {
		this.workshops = [];
		this.subscription.add(
			this.workshop_service.getWorkshops(this.selected_project[1]).subscribe(
				(workshops: Workshop[]) => {
					for (const workshop of workshops) {
						this.subscription.add(
							this.workshop_service.loadWorkshopWithVms(workshop.id).subscribe(
								(workshop_with_vms: Workshop) => {
									this.workshops.push(workshop_with_vms);
								},
							),
						);
					}
				},
			),
		);
	}

	load_project_data(): void {
		this.subscription.add(
			this.group_service.getGroupResources(this.selected_project[1].toString()).subscribe((res: ApplicationRessourceUsage): void => {
				this.selected_project_ressources = new ApplicationRessourceUsage(res);
				this.data_loaded = true;
				this.check_project_data_loaded();
			}),
		);
		this.get_images(this.selected_project[1]);
		this.get_flavors(this.selected_project[1]);
		this.get_members_of_the_project();
	}

	get_forc(): void {
		this.subscription.add(
			this.group_service.getClientForcUrl(this.selected_project[1].toString()).subscribe((response: JSON): void => {
				if (response['forc_url'] !== null) {
					this.has_forc = true;
					this.forc_url = response['forc_url'];
				}
			}),
		);
	}

	get_images(id: number): void {
		this.subscription.add(
			this.image_service.getImages(id).subscribe((images: Image[]): void => {
				this.images = images;
				this.images.sort((x_cord: any, y_cord: any): number => Number(x_cord.is_snapshot) - Number(y_cord.is_snapshot));
				this.image_loaded = true;
				this.check_project_data_loaded();
			}),
		);
	}

	get_flavors(id: number): void {
		this.subscription.add(
			this.flavor_service.getFlavors(id).subscribe(
				(flavors: Flavor[]): void => {
					this.flavors = flavors;
					this.flavor_types = this.flavor_service.sortFlavors(this.flavors);
					this.flavors_loaded = true;
					this.check_project_data_loaded();
				},
				(error: any) => {
					console.log(error);
					this.flavors = [];
					this.flavor_types = {};
					this.flavors_loaded = true;
					this.check_project_data_loaded();
				},
			),
		);
	}

	check_project_data_loaded(): void {
		if (this.image_loaded && this.flavors_loaded && this.data_loaded && this.member_data_loaded) {
			this.project_data_loaded = true;
			this.is_loaded = true;
		}
	}

	set_selected_workshop(workshop: Workshop): void {
		this.selected_workshop = workshop;
		this.workshop_data_loaded = true;

		for (const member of this.project_members) {
			member.vm_amount = 0;
			member.hasVM = false;
			for (const workshopvm of this.selected_workshop.vm_list) {
				if (member.elixirId === workshopvm.elixirid) {
					member.hasVM = true;
					member.vm_amount += 1;
				}
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	unsorted(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
		return 0;
	}

	set_selected_flavor_type(key: string): void {
		this.selected_flavor_type = key;
	}

	set_selected_flavor(flavor: Flavor): void {
		this.selected_flavor = flavor;
		this.new_cores = this.selected_flavor.vcpus;
		this.new_ram = this.selected_flavor.ram;
		this.new_gpus = this.selected_flavor.gpu;
	}

	set_selected_image(image: Image): void {
		this.selected_image = image;
		this.has_image_resenv();
	}

	has_image_resenv(): void {
		for (const mode of this.selected_image.modes) {
			for (const template of this.res_env_component.templates) {
				if (template.template_name === mode.name) {
					this.resenv_selected = true;
					this.res_env_component.setOnlyNamespace(template);

					return;
				}
			}
		}
		this.resenv_selected = false;
		this.res_env_component.unsetOnlyNamespace();
	}

	get_playbook_information(name: string): string {
		const playbook_info: {
			[name: string]: {
				[variable: string]: string
			}
		} = {};

		if (this.res_env_component && this.res_env_component.selectedTemplate.template_name !== 'undefined') {
			playbook_info[this.res_env_component.selectedTemplate.template_name] = { create_only_backend: `${this.res_env_component.getCreateOnlyBackend()}` };
			playbook_info['user_key_url'] = { user_key_url: name };
		}

		return JSON.stringify(playbook_info);
	}

	/**
	 * Creates a concatenation of workshop shortname and user name.
	 * Also translates all characters to latin representation, removes all other characters not in [a-zA-Z0-9] and slices
	 * it to max 64 characters.
	 * @param user_name Name to append to workshop shortname.
	 */
	create_name(user_name: string): string {
		let name: string = `${this.selected_workshop.shortname}${user_name}`;
		name = transliterate(name);
		name = name.replace(/[^a-zA-Z0-9]/g, '');
		name = name.slice(0, 25);

		return name;
	}

	start_vms(): void {
		this.started_machine = true;
		const servers: { [key: string]: string }[] = [];
		const re: RegExp = /\+/gi;
		const flavor_fixed: string = this.selected_flavor.name.replace(re, '%2B');
		for (const member of this.members_to_add) {
			const name: string = this.create_name(`${member.lastName}${member.firstName}`);

			// Playbook and Research-Environment stuff
			const playbook_information: string = this.get_playbook_information(name);
			servers.push({
				name, playbook_information, elixirId: member.elixirId, userName: `${member.lastName}${member.firstName}`,
			});
		}
		this.delay(500).then((): any => {
			this.progress_bar_width = 50;
		}).catch((): any => {
		});
		this.subscription.add(
			this.virtual_machine_service.startWorkshopVMs(
				flavor_fixed,
				this.selected_image,
				servers,
				this.selected_project[0],
				this.selected_project[1].toString(),
				this.selected_workshop.shortname,
			).subscribe(() => {
				this.progress_bar_width = 75;
				setTimeout(
					(): void => {
						void this.router.navigate(['/virtualmachines/vmOverview']).then().catch();
					},
					2000,
				);
			}, (error: any) => {
				console.log(error);
			}),
		);
	}

	async delay(ms: number): Promise<any> {
		// eslint-disable-next-line no-promise-executor-return
		await new Promise((resolve: any): any => setTimeout(resolve, ms));
	}

	add_member(member: ProjectMember): void {
		this.members_to_add.push(member);
	}

	remove_member(member: ProjectMember): void {
		this.members_to_add.splice(this.members_to_add.indexOf(member), 1);
	}

	reset_all_data(): void {
		this.selected_project = null;
		this.selected_workshop = null;
		this.workshops = [];
		this.reset_on_project_change();
		this.reset_on_workshop_change();
	}

	reset_on_project_change(): void {
		this.reset_on_workshop_change();
		this.has_forc = false;
		this.forc_url = '';
		this.selected_project_client = null;
		this.client_checked = false;
		this.client_available = false;
		this.project_data_loaded = false;
		this.flavors = [];
		this.image_loaded = false;
		this.data_loaded = false;
		this.flavors_loaded = false;
		this.images = [];
		this.selected_workshop = null;
		this.credits_allowed = false;
		this.project_members = [];
		this.member_data_loaded = false;
		this.selected_project_ressources = null;
		this.flavor_types = {};
	}

	reset_on_workshop_change(): void {
		this.new_cores = 0;
		this.new_gpus = 0;
		this.new_ram = 0;
		this.new_vms = 0;
		this.workshop_data_loaded = false;
		this.selected_image = undefined;
		this.selected_flavor = undefined;
		this.selected_flavor_type = 'Standard Flavors';
		this.members_to_add = [];
		this.vm_responsibility = false;
		this.started_machine = false;
		this.resenv_selected = false;
		this.res_env_valid = true;
		this.res_env_needs_template = false;
		this.res_env_okay_needed = false;
		this.gave_okay = false;
		this.progress_bar_width = 0;
		if (this.res_env_component) {
			this.res_env_component.resetData();
		}
	}

}
