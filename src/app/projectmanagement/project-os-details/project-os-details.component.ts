import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { GroupService } from '../../api-connector/group.service'
import { Application } from '../../applications/application.model/application.model'

/**
 * Project OpenStack Details Component.
 */
@Component({
	selector: 'app-project-os-details',
	templateUrl: './project-os-details.component.html',
	styleUrls: ['./project-os-details.component.css'],
	providers: [GroupService],
	imports: []
})
export class ProjectOsDetailsComponent implements OnInit, OnChanges {
	@Input() project: Application

	details_loaded: boolean = false
	show_error: boolean = false

	constructor(private groupService: GroupService) {
		this.groupService = groupService
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	ngOnChanges(changes: SimpleChanges): void {
		this.details_loaded = false
		this.getProjectDetails()
	}

	ngOnInit(): void {
		this.details_loaded = false
		this.show_error = false
		this.getProjectDetails()
	}

	getProjectDetails(): void {
		if (!this.project.project_application_perun_id || this.project.project_application_openstack_project) {
			return
		}
		this.groupService.getProjectOSDetails(this.project.project_application_perun_id).subscribe(
			(): void => {
				this.details_loaded = true
			},
			() => {
				this.details_loaded = true
				this.show_error = true
			}
		)
	}
}
