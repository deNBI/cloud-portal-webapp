import {Component, Input, OnInit} from '@angular/core';
import {ProjectMember} from '../../projectmanagement/project_member.model';
import {GroupService} from '../../api-connector/group.service';

@Component({
             selector: 'app-project-user-list',
             templateUrl: './project-user-list.component.html',
             styleUrls: ['./project-user-list.component.scss'],
             providers: [GroupService]
           })
export class ProjectUserListComponent implements OnInit {
  @Input() project_id: string | number;
  @Input() user_member_id: string;
  project_members: ProjectMember[] = [];
  @Input() members_to_add: ProjectMember[] = [];

  constructor(private groupService: GroupService) {
  }

  getMembersOfTheProject(): void {
    this.groupService.getGroupMembers(this.project_id.toString()).subscribe((members: ProjectMember[]): void => {

      this.project_members = members.filter((mem: ProjectMember): boolean => {
        return mem.memberId.toString() !== this.user_member_id.toString()
      });

    })
  }

  addMember(member: ProjectMember): void {
    this.members_to_add.push(member)
  }

  removeMember(member: ProjectMember): void {
    this.members_to_add.splice(this.members_to_add.indexOf(member), 1)
  }

  ngOnInit(): void {
    this.getMembersOfTheProject()
  }

}
