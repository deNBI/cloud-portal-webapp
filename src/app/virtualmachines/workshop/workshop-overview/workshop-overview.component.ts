import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Workshop } from '../workshop.model';
import { GroupService } from '../../../api-connector/group.service';
import { UrlData } from '../workshop-urlinfo.model';
import { WorkshopService } from '../../../api-connector/workshop.service';

@Component({
	selector: 'app-overview',
	templateUrl: './workshop-overview.component.html',
	styleUrls: ['./workshop-overview.component.scss'],
	providers: [GroupService, WorkshopService],
})
export class WorkshopOverviewComponent implements OnInit, OnDestroy {

	title: string = 'Workshop Overview';

	subscription: Subscription = new Subscription();
	urlDataSubscription: Subscription = new Subscription();
	workshops: Workshop[] = [];
	selectedWorkshop: Workshop;
	projects: [string, number][] = [];
	selectedProject: [string, number];
	errorMessage: string = null;
	isLoaded: boolean = false;
	projectWorkshopsLoading: boolean = false;
	projectWorkshopsLoaded: boolean = false;

	constructor(private workshopService: WorkshopService,
							private groupService: GroupService) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.getProjects();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this.urlDataSubscription.unsubscribe();
	}

	getProjects(): void {
		this.projects = [];
		this.subscription.add(
			this.groupService.getSimpleVmByUserWhereWorkshopAndAdmin().subscribe(
				(projects: any) => {
					for (const project of projects) {
						this.projects.push(project);
					}
					this.isLoaded = true;
				},
			),
		);
	}

	resetDataOnProjectChange(): void {
		this.projectWorkshopsLoaded = false;
		this.projectWorkshopsLoading = false;
		this.workshops = [];
	}

	getWorkshopsForProject(): void {
		this.projectWorkshopsLoading = true;
		this.subscription.add(
			this.workshopService.getWorkshops(this.selectedProject[1]).subscribe(
				(workshops: Workshop[]) => {
					this.workshops = workshops;
					this.projectWorkshopsLoading = false;
					this.projectWorkshopsLoaded = true;
				},
			),
		);
	}

	getUrlDataForWorkshopVms(): void {
		for (const vm of this.selectedWorkshop.vm_list) {
			if (vm.vm.openstackid && vm.vm.openstackid !== '') {
				vm.setLoadingUrlData(true);
				this.urlDataSubscription.add(
					this.workshopService.getUrlDataForWorkshopVm(this.selectedProject[1], this.selectedWorkshop.shortname, vm.vm.openstackid)
						.subscribe(
							(urlData: UrlData) => {
								vm.setLoadingUrlData(false);
								vm.setUrlData(urlData);
							},
						),
				);
			}
		}
	}

	setSelectedWorkshop(workshop: Workshop): void {
		this.selectedWorkshop = workshop;
		this.urlDataSubscription.unsubscribe();
		this.urlDataSubscription = new Subscription();
		this.getUrlDataForWorkshopVms();
	}

	check_project_data_loaded(): void {}

	cleanupWorkshop(): void {}

}
