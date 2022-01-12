import {
	Component, Input, OnDestroy, OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectMember } from '../../projectmanagement/project_member.model';
import { GroupService } from '../../api-connector/group.service';

/**
 * Project member list selection.
 */
@Component({
	selector: 'app-project-user-list',
	templateUrl: './project-user-list.component.html',
	providers: [GroupService],
})
export class ProjectUserListComponent implements OnInit, OnDestroy {
	@Input() project_id: string | number;
	@Input() user_member_id: number;
	project_members: ProjectMember[] = [];
	@Input() members_to_add: ProjectMember[] = [];
	subscription: Subscription = new Subscription();

	constructor(private groupService: GroupService) {
		this.groupService = groupService;
	}

	getMembersOfTheProject(): void {
		this.subscription.add(
			this.groupService.getGroupMembers(this.project_id.toString()).subscribe(
				(members: ProjectMember[]): void => {
					this.project_members = members.filter(
						(mem: ProjectMember): boolean => mem.memberId.toString() !== this.user_member_id.toString(),
					);
				},
			),
		);
	}

	addMember(member: ProjectMember): void {
		this.members_to_add.push(member);
	}

	removeMember(member: ProjectMember): void {
		this.members_to_add.splice(this.members_to_add.indexOf(member), 1);
	}

	ngOnInit(): void {
		this.getMembersOfTheProject();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

}
