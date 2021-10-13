import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Workshop } from '../workshop.model';
import { GroupService } from '../../../api-connector/group.service';
import { UrlData } from '../workshop-urlinfo.model';
import { WorkshopService } from '../../../api-connector/workshop.service';
import { ProjectMember } from '../../../projectmanagement/project_member.model';
import { WorkshopVM } from '../workshop-vm.model';
import { WIKI_WORKSHOPS } from '../../../../links/links';

interface MemberVm {
	projectMember: ProjectMember;
	workshopVmLink: { [key: number]: WorkshopVM[] };
}

@Component({
	selector: 'app-overview',
	templateUrl: './workshop-overview.component.html',
	styleUrls: ['./workshop-overview.component.scss'],
	providers: [GroupService, WorkshopService],
})
export class WorkshopOverviewComponent implements OnInit, OnDestroy {

	title: string = 'Workshop Overview';

	WIKI_WORKSHOPS: string = WIKI_WORKSHOPS;

	subscription: Subscription = new Subscription();
	workshops: Workshop[] = [];
	selectedWorkshop: Workshop;
	memberVms: MemberVm[] = [];
	loadedVmsForWorkshop: number[] = [];
	projects: [string, number][] = [];
	selectedProject: [string, number];
	errorMessage: string = null;
	isLoaded: boolean = false;
	projectWorkshopsLoading: boolean = false;
	projectWorkshopsLoaded: boolean = false;
	projectMembersLoading: boolean = false;
	projectMembersLoaded: boolean = false;
	deleting: boolean = false;
	deleteSuccess: boolean = false;

	constructor(private workshopService: WorkshopService,
							private groupService: GroupService) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit(): void {
		this.getProjects();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
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

	projectChange(): void {
		this.resetsOnProjectChange();
		this.getWorkshopsForProject();
		this.getMembersOfTheProject();
	}

	getWorkshopsForProject(): void {
		this.projectWorkshopsLoading = true;
		this.subscription.add(
			this.workshopService.getWorkshops(this.selectedProject[1]).subscribe(
				(workshops: Workshop[]) => {
					this.workshops = workshops;
					this.selectedWorkshop = new Workshop();
					this.projectWorkshopsLoading = false;
					this.projectWorkshopsLoaded = true;
				},
			),
		);
	}

	getMembersOfTheProject(): void {
		this.projectMembersLoading = true;
		this.memberVms = [];
		this.subscription.add(
			this.groupService.getWorkshopMembers(this.selectedProject[1].toString()).subscribe(
				(members: ProjectMember[]): void => {
					for (const member of members) {
						const workshopVmLink: {[key: number]: WorkshopVM[]} = {};
						const membervm: MemberVm = { projectMember: member, workshopVmLink };
						this.memberVms.push(membervm);
						this.projectMembersLoading = false;
						this.projectMembersLoaded = true;
					}
				},
			),
		);
	}

	workshopChange(workshop: Workshop): void {
		this.selectedWorkshop = workshop;
		this.loadVmsForSelectedProject();
	}

	loadVmsForSelectedProject(): void {
		if (this.loadedVmsForWorkshop.includes(this.selectedWorkshop.id)) {
			return;
		}

		this.subscription.add(
			this.workshopService.loadWorkshopWithVms(this.selectedWorkshop.id).subscribe(
				(workshopIncoming: Workshop) => {
					for (let workshop of this.workshops) {
						if (workshop.id === workshopIncoming.id) {
							workshop = workshopIncoming;
							this.loadedVmsForWorkshop.push(workshop.id);
							this.addVmsToProjectMembers(workshop);
							this.getUrlDataForWorkshopVms(workshop);
						}
					}
				},
			),
		);
	}

	addVmsToProjectMembers(workshop: Workshop): void {
		for (const member of this.memberVms) {
			if (!(workshop.id in member.workshopVmLink)) {
				member.workshopVmLink[workshop.id] = [];
			}
			for (const vm of workshop.vm_list) {
				if (member.projectMember.elixirId === vm.elixirid) {
					member.workshopVmLink[workshop.id].push(vm);
				}
			}
		}
	}

	getUrlDataForWorkshopVms(workshop: Workshop): void {
		for (const member of this.memberVms) {
			if (!(workshop.id in member.workshopVmLink)) {
				continue;
			}
			for (const vm of member.workshopVmLink[workshop.id]) {
				if (vm.vm.openstackid && vm.vm.openstackid !== '') {
					vm.setLoadingUrlData(true);
					this.subscription.add(
						this.workshopService.getResenvUrlForWorkshopVm(workshop.id, vm.vm.openstackid)
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
	}

	cleanupWorkshop(): void {
		const selectedId = this.selectedWorkshop.id;
		this.selectedWorkshop = new Workshop();
		this.deleting = true;
		this.subscription.add(
			this.workshopService.deleteWorkshop(selectedId).subscribe(
				(result: boolean) => {
					this.deleting = false;
					if (result) {
						this.deleteSuccess = true;
						for (const workshop of this.workshops) {
							if (workshop.id === selectedId) {
								this.workshops.splice(this.workshops.indexOf(workshop), 1);
							}
						}
					} else {
						this.deleteSuccess = false;
					}
				},
			),
		);
	}

	resetsOnProjectChange(): void {
		this.projectWorkshopsLoading = false;
		this.projectWorkshopsLoaded = false;

		this.projectWorkshopsLoading = false;
		this.projectMembersLoaded = false;

		this.workshops = [];
		this.memberVms = [];
		this.loadedVmsForWorkshop = [];
	}

}
