import { ProjectMember } from '../../projectmanagement/project_member.model';

export class Workshop {
	id: number;
	members: ProjectMember[];
	longname: string = '';
	shortname: string = '';

	constructor(workshop?: Partial<Workshop>) {
		Object.assign(this, workshop);
		this.members = [];
		if (workshop) {
			if (workshop.members) {
				for (const member of workshop.members) {
					this.members.push(new ProjectMember(member));
				}
			}

		}
	}
}
