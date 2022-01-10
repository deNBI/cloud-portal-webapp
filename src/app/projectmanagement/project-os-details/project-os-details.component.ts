import {
	Component, Input, OnChanges, OnInit, SimpleChanges,
} from '@angular/core';
import { VirtualMachine } from '../../virtualmachines/virtualmachinemodels/virtualmachine';
import { Volume } from '../../virtualmachines/volumes/volume';
import { SnapshotModel } from '../../virtualmachines/snapshots/snapshot.model';
import { GroupService } from '../../api-connector/group.service';
import { Application } from '../../applications/application.model/application.model';

/**
 * Project OpenStack Details Component.
 */
@Component({
	selector: 'app-project-os-details',
	templateUrl: './project-os-details.component.html',
	styleUrls: ['./project-os-details.component.css'],
	providers: [GroupService],
})
export class ProjectOsDetailsComponent implements OnInit, OnChanges {

	@Input() project: Application;
	selectedProjectVms: VirtualMachine[] = [];
	selectedProjectVolumes: Volume[] = [];
	selectedProjectSnapshots: SnapshotModel[] = [];
	details_loaded: boolean = false;

	constructor(private groupService: GroupService) {
		this.groupService = groupService;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	ngOnChanges(changes: SimpleChanges): void {
		this.details_loaded = false;
		this.getProjectDetails();
	}

	ngOnInit(): void {
		this.details_loaded = false;
		this.getProjectDetails();
	}

	getProjectDetails(): void {
		this.groupService.getProjectOSDetails(this.project.project_application_perun_id).subscribe((res: any): void => {
			this.selectedProjectVms = res['vms'];
			this.selectedProjectVolumes = res['volumes'];
			this.selectedProjectSnapshots = res['snapshots'];
			this.details_loaded = true;
		});
	}

}
