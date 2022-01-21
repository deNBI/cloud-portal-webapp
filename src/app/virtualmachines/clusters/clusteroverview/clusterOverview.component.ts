/* eslint-disable no-mixed-spaces-and-tabs */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { VirtualmachineService } from '../../../api-connector/virtualmachine.service';
import { FullLayoutComponent } from '../../../layouts/full-layout.component';
import { UserService } from '../../../api-connector/user.service';
import { ImageService } from '../../../api-connector/image.service';
import { FacilityService } from '../../../api-connector/facility.service';
import { elixir_id, is_vo } from '../../../shared/globalvar';
import { VirtualMachineStates } from '../../virtualmachinemodels/virtualmachinestates';
import { GroupService } from '../../../api-connector/group.service';
import { ClientService } from '../../../api-connector/client.service';
import { Clusterinfo } from '../clusterinfo';
import { CLOUD_PORTAL_SUPPORT_MAIL, SCALE_SCRIPT_LINK, STATUS_LINK } from '../../../../links/links';
import { AbstractBaseClass } from '../../../shared/shared_modules/baseClass/abstract-base-class';
import { Flavor } from '../../virtualmachinemodels/flavor';
import { FlavorService } from '../../../api-connector/flavor.service';
import { ClusterPage } from '../clusterPage.model';

export const SCALING_SCRIPT_NAME: string = 'scaling.py';

/**
 * Cluster overview componentn.
 */
@Component({

	selector: 'app-cluster-overview',
	templateUrl: './clusterOverview.component.html',
	styleUrls: ['../../vmOverview.component.scss'],
	providers: [FacilityService, ImageService, UserService,
		VirtualmachineService, FullLayoutComponent, GroupService, ClientService, GroupService, FlavorService],
})

export class ClusterOverviewComponent extends AbstractBaseClass implements OnInit, OnDestroy {
	title: string = 'Cluster Overview';

	private subscription: Subscription = new Subscription();

	VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();

	cluster_page: ClusterPage = new ClusterPage();
	currentPage: number = 1;
	DEBOUNCE_TIME: number = 300;
	FILTER_DEBOUNCE_TIME: number = 2000;
	SCALING_SCRIPT_LINK: string = SCALE_SCRIPT_LINK;
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;
	STATUS_LINK: string = STATUS_LINK;
	user_elixir_id: string = elixir_id;

	isSearching: boolean = true;

	/**
	 * Facilities where the user is manager ['name',id].
	 */
	public managerFacilities: [string, number][];
	/**
	 * Chosen facility.
	 */
	public selectedFacility: [string, number];

	filter: string;
	cluster_per_site: number = 7;
	total_pages: number;
	total_items: number;
	clusters: Clusterinfo[] = [];
	/**
	 * If user is vo admin.
	 */

	items_per_page: number = 7;

	is_vo_admin: boolean;
	flavors: Flavor[] = [];
	flavors_usable: Flavor[] = [];
	flavors_loaded: boolean = false;

	/**
	 * Tab which is shown own|all.
	 *
	 * @type {string}
	 */
	tab: string = 'own';

	is_facility_manager: boolean = false;

	clusterPerPageChange: Subject<number> = new Subject<number>();

	filterChanged: Subject<string> = new Subject<string>();

	constructor(
		private facilityService: FacilityService,
		private groupService: GroupService,
		private imageService: ImageService,
		private userService: UserService,
		private virtualmachineservice: VirtualmachineService,
		private fb: FormBuilder,
		private clipboardService: ClipboardService,
		private flavorService: FlavorService,
	) {
		super();

	}

	/**
	 * Apply filter to all vms.
	 */
	applyFilter(): void {
		this.isSearching = true;
		if (typeof (this.cluster_per_site) !== 'number' || this.cluster_per_site <= 0) {
			this.cluster_per_site = 7;
		}
		if (this.tab === 'own') {
			this.getClusters();
		} else if (this.tab === 'all') {
			this.getAllClusters();
		} else if (this.tab === 'facility') {
			this.getAllCLusterFacilities();
		}

	}

	/**
	 * How to track the child cluster cards.
	 * @param index Track by a number or a string.
	 * @param vm Track by vm openstackid.
	 */
	trackByCluster(index: number | string, cluster: Clusterinfo): string {
		return cluster.cluster_id;
	}

	copyToClipboard(text: string): void {
		if (this.clipboardService.isSupported) {
			this.clipboardService.copy(text);
		}
	}

	get_is_facility_manager(): void {
		this.subscription.add(
			this.facilityService.getManagerFacilities().subscribe((result: any): void => {
				if (result.length > 0) {
					this.is_facility_manager = true;
				}
			}),
		);
	}

	/**
	 * Toggle tab own|all.
	 *
	 * @param tabString
	 */
	toggleTab(tabString: string): void {
		this.tab = tabString;
	}

	/**
	 * Load vms depending on page.
	 *
	 * @param event
	 */
	pageChanged(event: any): void {
		this.isSearching = true;

		this.currentPage = event.page;
		if (this.tab === 'own') {
			this.getClusters();
		} else if (this.tab === 'all') {
			this.getAllClusters();
		} else if (this.tab === 'facility') {
			this.getAllCLusterFacilities();
		}
	}

	/**
	 * Get all vms of user.
	 */
	getClusters(): void {
		this.subscription.add(
			this.virtualmachineservice.getClusters(this.currentPage, this.cluster_per_site)
				.subscribe((cluster_page: ClusterPage): void => {
					this.prepareClusters(cluster_page);
				}),
		);
	}

	getAllCLusterFacilities(): void {
		this.subscription.add(
			this.facilityService.getClustersFacility(
				this.selectedFacility['FacilityId'],
				this.currentPage,
				this.cluster_per_site,
			)
				.subscribe((cluster_page_infos: ClusterPage): void => {
					this.prepareClusters(cluster_page_infos);
				}),
		);
	}

	prepareClusters(cluster_page_infos: ClusterPage): void {
		this.cluster_page = cluster_page_infos;
		// this.clusters = cluster_page_infos['cluster_list'].map((cluster: Clusterinfo): Clusterinfo => new Clusterinfo(cluster));
		// this.total_items = cluster_page_infos['total_items'];
		// this.items_per_page = cluster_page_infos['items_per_page'];
		// this.total_pages = cluster_page_infos['num_pages'];

		this.isSearching = false;
	}

	getAllClusters(): void {
		this.subscription.add(
			this.virtualmachineservice.getAllClusters(this.currentPage, this.cluster_per_site)
				.subscribe((cluster_page_infos: ClusterPage): void => {
					this.prepareClusters(cluster_page_infos);
				}),
		);
	}

	ngOnInit(): void {
		this.getClusters();
		this.is_vo_admin = is_vo;
		this.get_is_facility_manager();
		this.subscription.add(
			this.facilityService.getManagerFacilities().subscribe((result: any): void => {
				this.managerFacilities = result;
				this.selectedFacility = this.managerFacilities[0];
			}),
		);

		this.subscription.add(
			this.filterChanged
				.pipe(
					debounceTime(this.FILTER_DEBOUNCE_TIME),
					distinctUntilChanged(),
				)
				.subscribe((): void => {
					this.applyFilter();
				}),
		);

		this.subscription.add(
			this.clusterPerPageChange.pipe(
				debounceTime(this.DEBOUNCE_TIME),
				distinctUntilChanged(),
			)
				.subscribe((): void => {
					this.applyFilter();
				}),
		);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

}
