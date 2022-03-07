import {
	Component, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import {
	forkJoin, lastValueFrom, Subject, Subscription,
} from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Volume } from './volume';
import { VirtualmachineService } from '../../api-connector/virtualmachine.service';
import { VirtualMachine } from '../virtualmachinemodels/virtualmachine';
import { GroupService } from '../../api-connector/group.service';
import { AbstractBaseClass } from '../../shared/shared_modules/baseClass/abstract-base-class';
import { VolumeActionStates } from './volume-action-states.enum';
import { VolumeRequestStates } from './volume-request-states.enum';
import { IResponseTemplate } from '../../api-connector/response-template';
import { FacilityService } from '../../api-connector/facility.service';
import { WIKI_EXTEND_VOLUME, WIKI_VOLUME_OVERVIEW, CLOUD_PORTAL_SUPPORT_MAIL } from '../../../links/links';
import { VolumeStates } from './volume_states';
import { VirtualMachineStates } from '../virtualmachinemodels/virtualmachinestates';
import { VolumePage } from './volumePage.model';

/**
 * Volume overview component.
 */
@Component({
	selector: 'app-volume-overview',
	templateUrl: 'volumeOverview.component.html',
	providers: [FacilityService, GroupService, VirtualmachineService],
	styleUrls: ['../vmOverview.component.scss'],
})
export class VolumeOverviewComponent extends AbstractBaseClass implements OnInit, OnDestroy {
	@ViewChild('errorModal') errorModal: any;

	volume_page: VolumePage = new VolumePage();

	WIKI_EXTEND_VOLUME: string = WIKI_EXTEND_VOLUME;
	WIKI_VOLUME_OVERVIEW: string = WIKI_VOLUME_OVERVIEW;
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;
	title: string = 'Volume Overview';
	selected_volume_data_loaded: boolean = false;
	filter: string;
	checked_volumes: Volume[] = [];

	/**
	 * Enum of all volume action states.
	 */
	volumeActionStates: typeof VolumeActionStates = VolumeActionStates;
	extendError: boolean = false;
	extendDone: boolean = false;

	showFacilities: boolean = false;

	/**
	 * Enum of all request states.
	 *
	 * @type {VolumeRequestStates}
	 */
	volumeRequestStates: typeof VolumeRequestStates = VolumeRequestStates;

	/**
	 * Facilitties where the user is manager ['name',id].
	 */
	managerFacilities: [string, number][] = [];
	/**
	 * Chosen facility.
	 */
	selectedFacility: [string, number];

	/**
	 * Array of volumes from the selected Project.
	 */
	project_vms: VirtualMachine[];
	/**
	 * Selected vm.
	 */
	selected_vm: VirtualMachine;
	/**
	 * If the site is loaded.
	 *
	 * @type {boolean}
	 */
	isLoaded: boolean = false;
	/**
	 * Selected volume.
	 */
	selected_volume: Volume;
	/**
	 * Diskspace max from selected Project.
	 */
	selectedProjectDiskspaceMax: number;
	/**
	 * Diskspace used from selected Project.
	 */
	selectedProjectDiskspaceUsed: number;
	/**
	 * Volumes max from selected Project.
	 */
	selectedProjectVolumesMax: number;
	/**
	 * Volumes used from selected Project.
	 */
	selectedProjectVolumesUsed: number;
	/**
	 * Diskspace actual + addition if new volume would be created for selected Project.
	 */
	selectedProjectDiskSpaceSum: number;
	/**
	 * The selected Project [name,id].
	 */
	selectedProject: [string, number];
	/**
	 * List of all projects from the user.
	 *
	 * @type {any[]}
	 */
	projects: string[] = [];
	/**
	 * Default volumeStorage.
	 *
	 * @type {number}
	 */
	diskspace: number = 1;
	/**
	 * Default volumename.
	 *
	 * @type {string}
	 */
	volumeName: string = '';
	/**
	 * Action which is performed with a volume.
	 */
	volume_action_status: number;

	extendVolumeStorage: number;

	/**
	 * Type of request.
	 */
	request_status: number;
	private checkStatusSubscription: Subscription = new Subscription();
	private getVolumesSubscription: Subscription = new Subscription();
	private checkStatusTimeout: number = 5000;
	VolumeStates: VolumeStates = new VolumeStates();
	volumePerPageChange: Subject<number> = new Subject<number>();
	filterChanged: Subject<string> = new Subject<string>();
	DEBOUNCE_TIME: number = 1000;
	currentPage: number = 1;
	isSearching: boolean = true;
	all_volumes_checked: boolean = false;
	selected_volumes_to_detach: boolean = false;
	VOLUME_END_STATES: string[] = [
		VolumeStates.AVAILABLE,
		VolumeStates.NOT_FOUND,
		VolumeStates.IN_USE,
		VirtualMachineStates.DELETED,
		VirtualMachineStates.DELETING_FAILED,
	];

	constructor(
		private facilityService: FacilityService,
		private groupService: GroupService,
		private vmService: VirtualmachineService,
	) {
		super();
	}

	ngOnDestroy(): void {
		this.checkStatusSubscription.unsubscribe();
		this.getVolumesSubscription.unsubscribe();
	}

	changedFilter(text: string): void {
		this.filterChanged.next(text);
	}

	isVolChecked(vol: Volume): boolean {
		return this.checked_volumes.indexOf(vol) !== -1;
	}

	changeCheckedVolume(vol: Volume): void {
		if (!this.isVolChecked(vol)) {
			this.checked_volumes.push(vol);
		} else {
			this.checked_volumes.splice(this.checked_volumes.indexOf(vol), 1);
		}
		this.areAllVolumesChecked();
		this.areSelectedVolumesDetachable();
	}

	areSelectedVolumesDetachable(): void {
		this.selected_volumes_to_detach = false;
		this.checked_volumes.forEach((vol: Volume): void => {
			if (vol.volume_virtualmachine) {
				this.selected_volumes_to_detach = true;
			}
		});
	}

	uncheckAll(): void {
		this.checked_volumes = [];
		this.all_volumes_checked = false;
		this.selected_volumes_to_detach = false;
	}

	deleteSelectedVolumes(): void {
		const delete_vols: Volume[] = this.checked_volumes;
		const vol_ids: string[] = this.checked_volumes.map((vol: Volume): string => {
			vol.volume_status = VolumeStates.DELETING;

			return vol.volume_openstackid;
		});
		this.vmService.deleteVolumes(vol_ids).subscribe((): void => {
			delete_vols.forEach((vol: Volume): void => {
				vol.volume_status = VolumeStates.DELETED;
			});
		});

		this.uncheckAll();
	}

	detachSelectedVolumes(): void {
		const detach_vols: Volume[] = this.checked_volumes;
		const vol_ids: string[] = this.checked_volumes.map((vol: Volume): string => {
			if (vol.volume_virtualmachine) {
				vol.volume_status = VolumeStates.DETACHING;

				return vol.volume_openstackid;
			} else {
				return null;
			}
		});
		this.vmService.deleteVolumeAttachments(vol_ids).subscribe((): void => {
			detach_vols.forEach((vol: Volume): void => {
				this.check_status_loop(vol, 2000, VolumeStates.AVAILABLE);
			});
		});

		this.uncheckAll();
	}

	areAllVolumesChecked(): void {
		let all_checked: boolean = true;
		this.volume_page.volume_list.forEach((vol: Volume): void => {
			if (!this.isVolChecked(vol)) {
				all_checked = false;
			}
		});

		this.all_volumes_checked = all_checked;
	}

	changeCheckAllVolumes(): void {
		if (this.all_volumes_checked) {
			this.checked_volumes = [];
			this.all_volumes_checked = false;

			return;
		}

		this.volume_page.volume_list.forEach((vol: Volume): void => {
			if (!this.isVolChecked(vol)) {
				this.checked_volumes.push(vol);
			}
		});
		this.all_volumes_checked = true;
		this.areSelectedVolumesDetachable();
	}

	setSelectedProjectByVolume(volume: Volume): void {
		this.selectedProject = [volume.volume_project, parseInt(volume.volume_projectid, 10)];
	}

	ngOnInit(): void {
		this.getVolumes();
		this.getUserApprovedProjects();
		this.facilityService.getManagerFacilities().subscribe((result: any): void => {
			this.managerFacilities = result;
			this.selectedFacility = this.managerFacilities[0];
		});
		this.filterChanged
			.pipe(
				debounceTime(this.DEBOUNCE_TIME),
				distinctUntilChanged(),
				switchMap((filter: string): any => {
					this.isSearching = true;

					this.filter = filter.trim();

					return this.vmService.getVolumesByUser(this.volume_page.items_per_page, this.currentPage, this.filter);
				}),
			)
			.subscribe((volume_page: VolumePage): void => {
				this.volume_page = volume_page;
				for (const volume of this.volume_page.volume_list) {
					this.setCollapseStatus(volume.volume_openstackid, false);
				}
				this.isSearching = false;
				this.volume_page.volume_list.forEach((vol: Volume): void => {
					if (
						vol.volume_status !== VolumeStates.AVAILABLE
						&& vol.volume_status !== VolumeStates.NOT_FOUND
						&& vol.volume_status !== VolumeStates.IN_USE
					) {
						this.check_status_loop(vol);
					}
				});
			});
		this.volumePerPageChange.pipe(debounceTime(this.DEBOUNCE_TIME), distinctUntilChanged()).subscribe((): void => {
			if (this.volume_page.items_per_page && this.volume_page.items_per_page > 0) {
				if (this.showFacilities) {
					this.getFacilityVolumes();
				} else {
					this.getVolumes();
				}
			}
		});
	}

	/**
	 * Attach a volume to an instance.
	 *
	 * @param volume volume with openstack_id
	 * @param instance_id openstack_id of the instance
	 * @returns
	 */
	async attachVolume(volume: Volume, instance_id: string): Promise<void> {
		await this.updateVolume(volume);

		volume = this.get_volume_from_list_by_id(volume.volume_openstackid);
		if (volume.volume_status !== VolumeStates.AVAILABLE) {
			volume.error_msg = 'Conflict detected. The volume can\'t be attached, because it is not AVAILABLE';
			setTimeout((): void => {
				volume.error_msg = null;
			}, 10000);

			return;
		}

		volume = this.get_volume_from_list_by_id(volume.volume_openstackid);

		volume.volume_status = VolumeStates.ATTACHING;
		this.vmService.attachVolumetoServer(volume.volume_openstackid, instance_id).subscribe(
			(result: IResponseTemplate): void => {
				if (result.value === 'attached') {
					this.volume_action_status = this.volumeActionStates.ATTACHING_SUCCESSFULL;
				} else {
					this.volume_action_status = this.volumeActionStates.ERROR;
				}
				this.check_status_loop(volume, 5000, VolumeStates.IN_USE);
			},
			(error: any): void => {
				if (error['error']['error'] === '409') {
					volume.error_msg =						'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
					setTimeout((): void => {
						volume.error_msg = null;
					}, 5000);
				}
				this.check_status_loop(volume, 0);
			},
		);
	}

	async extendVolume(volume: Volume, new_storage: number): Promise<void> {
		await this.updateVolume(volume);

		volume = this.get_volume_from_list_by_id(volume.volume_openstackid);
		if (volume.volume_status !== VolumeStates.AVAILABLE) {
			volume.error_msg = 'Conflict detected. The volume can\'t be extended, because it is not AVAILABLE';
			setTimeout((): void => {
				volume.error_msg = null;
			}, 10000);

			return;
		}

		volume.volume_status = VolumeStates.EXTENDING;
		this.vmService.extendVolume(volume.volume_openstackid, new_storage.toString()).subscribe((res: any): void => {
			if (res['status_code'] === 0) {
				this.check_status_loop(volume, 0, undefined, new_storage);
			} else {
				this.extendError = true;
				this.check_status_loop(volume, 0);
			}
		});
	}

	/**
	 * Load volumes depending on page.
	 *
	 * @param event
	 */
	pageChanged(event: any): void {
		this.isSearching = true;

		this.currentPage = event.page;
		if (this.showFacilities) {
			this.getFacilityVolumes();
		} else {
			this.getVolumes();
		}
	}

	getFacilityVolumes(): void {
		this.isSearching = true;
		this.getVolumesSubscription.unsubscribe();
		this.getVolumesSubscription = new Subscription();

		this.getVolumesSubscription.add(
			this.facilityService
				.getFacilityVolumes(this.selectedFacility['FacilityId'], this.volume_page.items_per_page, this.currentPage)
				.subscribe((volume_page: VolumePage): void => {
					this.volume_page = volume_page;
					for (const volume of this.volume_page.volume_list) {
						this.setCollapseStatus(volume.volume_openstackid, false);
					}

					this.isLoaded = true;
					this.isSearching = false;
					this.volume_page.volume_list.forEach((vol: Volume): void => {
						if (vol.volume_status !== VolumeStates.NOT_FOUND) {
							this.check_status_loop(vol);
						}
					});
				}),
		);
	}

	/**
	 * Create an volume and attach to an instance.
	 *
	 * @param volume_name name of the volume
	 * @param diskspace volumeStorage of the volume
	 * @param instance_id opentack_id of the instance
	 * @returns
	 */
	createAndAttachvolume(volume_name: string, diskspace: number, instance_id: string): void {
		this.volume_action_status = 7;
		this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe(
			async (newVolume: Volume): Promise<void> => {
				newVolume.volume_created_by_user = true;

				if (newVolume.volume_openstackid) {
					newVolume.volume_status = VolumeStates.CREATING;
					this.volume_page.volume_list.push(newVolume);
					await this.updateVolume(newVolume);
					let volume: Volume = this.get_volume_from_list_by_id(newVolume.volume_openstackid);
					while (volume.volume_status !== VolumeStates.AVAILABLE) {
						// eslint-disable-next-line no-await-in-loop
						await this.updateVolume(newVolume);

						volume = this.get_volume_from_list_by_id(newVolume.volume_openstackid);
					}

					this.volume_action_status = this.volumeActionStates.ATTACHING;

					this.vmService.attachVolumetoServer(volume.volume_openstackid, instance_id).subscribe(
						(res: IResponseTemplate): void => {
							if (res.value === 'attached') {
								this.volume_action_status = this.volumeActionStates.SUCCESSFULLY_CREATED_ATTACHED;
							} else {
								this.volume_action_status = this.volumeActionStates.ERROR;
							}
							this.check_status_loop(volume, 0);
						},
						(error: any): void => {
							if (error['error']['error'] === '409') {
								volume.error_msg =									'Conflict detected. '
									+ 'The virtual machine is currently creating a snapshot and must not be altered.';
								setTimeout((): void => {
									volume.error_msg = null;
								}, 5000);
							}
							this.check_status_loop(volume, 0);
						},
					);
				} else {
					this.volume_action_status = this.volumeActionStates.ERROR;
				}
			},
			(): void => {
				this.errorModal.show();
			},
		);
	}

	/**
	 * Create an volume.
	 *
	 * @param volume_name name of the volume.
	 * @param diskspace volumeStorage of the new volume
	 * @param instance_id openstack_id of instance.
	 * @returns
	 */
	createVolume(volume_name: string, diskspace: number, instance_id: string): void {
		this.volume_action_status = this.volumeActionStates.WAITING;
		this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe((newVolume: Volume): void => {
			if (newVolume.volume_openstackid) {
				this.volume_action_status = this.volumeActionStates.WAIT_CREATION;
				this.volume_page.volume_list.push(newVolume);
			} else {
				this.volume_action_status = this.volumeActionStates.ERROR;
			}
		});
	}

	deleteVolume(volume: Volume): void {
		volume.volume_status = VolumeStates.DELETING;
		this.vmService.deleteVolume(volume.volume_openstackid).subscribe((): void => {
			volume.volume_status = VolumeStates.DELETED;
		});
	}

	/**
	 * Detach volume from instance.
	 *
	 * @param volume
	 * @param instance_id openstack_id of the  instance
	 * @returns
	 */
	async detachVolume(volume: Volume, instance_id: string): Promise<void> {
		await this.updateVolume(volume);

		volume = this.get_volume_from_list_by_id(volume.volume_openstackid);
		if (volume.volume_status !== VolumeStates.IN_USE) {
			volume.error_msg = 'Conflict detected. The volume can\'t be detached, because it is not IN-USE';
			setTimeout((): void => {
				volume.error_msg = null;
			}, 10000);

			return;
		}

		this.volume_action_status = this.volumeActionStates.DETACHING_VOLUME;
		volume.volume_status = VolumeStates.DETACHING;
		this.vmService.deleteVolumeAttachment(volume.volume_openstackid, instance_id).subscribe(
			(result: any): void => {
				if (result.value === 'deleted') {
					this.volume_action_status = this.volumeActionStates.SUCCESSFULLY_DETACHED_VOLUME;
				} else {
					this.volume_action_status = this.volumeActionStates.ERROR;
				}
				this.check_status_loop(volume, 5000, VolumeStates.AVAILABLE);
			},
			(error: any): void => {
				if (error['error']['error'] === '409') {
					volume.error_msg =						'Conflict detected. The virtual machine is currently creating a snapshot and must not be altered.';
					setTimeout((): void => {
						volume.error_msg = null;
					}, 5000);
				}
				this.check_status_loop(volume, 0);
			},
		);
	}

	/**
	 * Rename a volume ( just in Django DB not in OpenStack).
	 *
	 * @param volume_id openstack_id of volume
	 * @param new_volume_name the new name
	 * @returns
	 */
	renameVolume(volume: Volume, new_volume_name: string): void {
		this.volume_action_status = this.volumeActionStates.CHANGING_NAME;
		this.vmService
			.renameVolume(volume.volume_openstackid, new_volume_name)
			.subscribe((changed_volume: Volume): void => {
				if (changed_volume.volume_name === new_volume_name) {
					this.volume_action_status = this.volumeActionStates.CHANGING_NAME_SUCESSFULL;
				} else {
					this.volume_action_status = this.volumeActionStates.ERROR;
				}
				this.volume_page.volume_list[this.volume_page.volume_list.indexOf(volume)] = changed_volume;
			});
	}

	/**
	 * Get all volumes from user.
	 *
	 * @returns
	 */
	getVolumes(): void {
		this.isSearching = true;
		this.getVolumesSubscription.unsubscribe();
		this.getVolumesSubscription = new Subscription();
		this.getVolumesSubscription.add(
			this.vmService
				.getVolumesByUser(this.volume_page.items_per_page, this.currentPage)
				.subscribe((volume_page: VolumePage): void => {
					this.volume_page = volume_page;
					for (const volume of this.volume_page.volume_list) {
						this.setCollapseStatus(volume.volume_openstackid, false);
					}

					this.isLoaded = true;
					this.isSearching = false;
					this.volume_page.volume_list.forEach((vol: Volume): void => {
						if (vol.volume_status !== VolumeStates.NOT_FOUND) {
							this.check_status_loop(vol);
						}
					});
				}),
		);
	}

	async updateVolume(volume: Volume): Promise<void> {
		const created: boolean = volume.volume_created_by_user;

		const vol: Volume = this.get_volume_from_list_by_id(volume.volume_openstackid);
		const updated_volume: Volume = await lastValueFrom(this.vmService.getVolumeById(vol.volume_openstackid));
		const idx: number = this.volume_page.volume_list.indexOf(vol);
		updated_volume.volume_created_by_user = created;
		this.volume_page.volume_list[idx] = updated_volume;
	}

	get_volume_from_list_by_id(openstack_id: string): Volume {
		for (const volume of this.volume_page.volume_list) {
			if (volume.volume_openstackid === openstack_id) {
				return volume;
			}
		}

		return null;
	}

	// eslint-disable-next-line default-param-last
	check_status_loop(
		volume: Volume,
		initial_timeout: number = this.checkStatusTimeout,
		final_state?: string,
		expected_storage?: number,
	): void {
		setTimeout(
			// eslint-disable-next-line consistent-return
			async (): Promise<void> => {
				await this.updateVolume(volume);
				const updated_volume: Volume = this.get_volume_from_list_by_id(volume.volume_openstackid);

				// eslint-disable-next-line consistent-return
				if (expected_storage && updated_volume.volume_storage !== expected_storage) {
					return this.check_status_loop(volume, this.checkStatusTimeout, final_state, expected_storage);
				} else if (expected_storage && updated_volume.volume_storage === expected_storage) {
					this.extendDone = true;
				}
				if (volume.error_msg !== '' && volume.error_msg !== undefined && volume.error_msg !== null) {
					updated_volume.error_msg = volume.error_msg;
					setTimeout((): void => {
						updated_volume.error_msg = null;
					}, 5000);
				}

				if (
					this.VOLUME_END_STATES.indexOf(updated_volume.volume_status) === -1
					&& final_state
					&& final_state !== updated_volume.volume_status
				) {
					console.log(final_state);
					console.log(volume.volume_status);
					console.log('####');
					this.check_status_loop(volume, this.checkStatusTimeout, final_state);
				}
			},

			initial_timeout,
		);
	}

	/**
	 * Get all approved projects from the user.
	 *
	 * @returns
	 */
	getUserApprovedProjects(): void {
		this.groupService.getSimpleVmByUser().subscribe((membergroups: any): void => {
			for (const project of membergroups) {
				this.projects.push(project);
			}
		});
	}

	/**
	 * Set request status.
	 *
	 * @param status
	 * @returns
	 */
	setRequestStatus(status: number): void {
		this.request_status = status;
	}

	/**
	 * Set selected volume.
	 *
	 * @param volume
	 * @returns
	 */
	setSelectedVolume(volume: Volume): void {
		this.selected_volume = volume;
	}

	/**
	 * Calc volumeStorage sum of selected project volumeStorage and additional volumeStorage of new volume.
	 */
	calcDiskSpaceSum(): void {
		this.selectedProjectDiskSpaceSum =			parseInt(this.diskspace.toString(), 10) + parseInt(this.selectedProjectDiskspaceUsed.toString(), 10);
	}

	getSelectedVolumeStorage(): void {
		this.setSelectedProjectByVolume(this.selected_volume);
		this.selected_volume_data_loaded = false;
		forkJoin(
			this.groupService.getGroupMaxDiskspace(this.selectedProject[1].toString()),
			this.groupService.getGroupUsedDiskspace(this.selectedProject[1].toString()),
		).subscribe((result: any): void => {
			if (result[0]['value']) {
				this.selectedProjectDiskspaceMax = result[0]['value'];
			} else {
				this.selectedProjectDiskspaceMax = 0;
			}
			if (result[1]['value']) {
				this.selectedProjectDiskspaceUsed = result[1]['value'];
			} else {
				this.selectedProjectDiskspaceUsed = 0;
			}
			this.selected_volume_data_loaded = true;
		});
	}

	/**
	 * Get volumeStorage of selected project.
	 *
	 * @returns
	 */
	getSelectedProjectDiskspace(): void {
		this.groupService
			.getGroupMaxDiskspace(this.selectedProject[1].toString())
			.subscribe((result: IResponseTemplate): void => {
				if (result.value) {
					this.selectedProjectDiskspaceMax = result.value as number;
				} else {
					this.selectedProjectDiskspaceMax = 0;
				}
			});
		this.groupService
			.getGroupUsedDiskspace(this.selectedProject[1].toString())
			.subscribe((result: IResponseTemplate): void => {
				if (result.value) {
					this.selectedProjectDiskspaceUsed = result.value as number;
				} else {
					this.selectedProjectDiskspaceUsed = 0;
				}
			});
	}

	/**
	 * Get volumes of selected project.
	 *
	 * @returns
	 */
	getSelectedProjectVolumes(): void {
		this.groupService
			.getVolumeCounter(this.selectedProject[1].toString())
			.subscribe((result: IResponseTemplate): void => {
				if (result.value) {
					this.selectedProjectVolumesMax = result.value as number;
				} else {
					this.selectedProjectVolumesMax = 0;
				}
			});
		this.groupService
			.getVolumesUsed(this.selectedProject[1].toString())
			.subscribe((result: IResponseTemplate): void => {
				if (result.value) {
					this.selectedProjectVolumesUsed = result.value as number;
				} else {
					this.selectedProjectVolumesUsed = 0;
				}
			});
	}

	/**
	 * Get all active vms from a project.
	 *
	 * @param groupid id of the perun group from the project.
	 * @returns
	 */
	getActiveVmsByProject(groupid: number | string): void {
		this.vmService.getActiveVmsByProject(groupid.toString()).subscribe((result: any): void => {
			this.project_vms = result;
		});
	}
}
