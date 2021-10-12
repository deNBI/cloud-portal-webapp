import { ProjectMember } from '../../projectmanagement/project_member.model';
import { WorkshopVM } from './workshop-vm.model';
import { UrlData } from './workshop-urlinfo.model';

export class Workshop {
	id: number;
	members: ProjectMember[];
	vm_list: WorkshopVM[];
	longname: string = '';
	shortname: string = '';
	url_data: UrlData[];

	constructor(workshop?: Partial<Workshop>) {
		Object.assign(this, workshop);
		this.members = [];
		this.vm_list = [];
		this.url_data = [];
		if (workshop) {
			if (workshop.members) {
				for (const member of workshop.members) {
					this.members.push(new ProjectMember(member));
				}
			}
			if (workshop.vm_list) {
				for (const vm of workshop.vm_list) {
					this.vm_list.push(new WorkshopVM(vm));
				}
			}
			if (workshop.url_data) {
				for (const url_data of workshop.url_data) {
					this.url_data.push(new UrlData(url_data));
				}
			}
		}
	}
}
