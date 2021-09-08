import { VirtualMachine } from '../virtualmachinemodels/virtualmachine';
import { ProjectMember } from '../../projectmanagement/project_member.model';
import { Application } from '../../applications/application.model/application.model';

export class Workshop {
	application: Application;
	members: ProjectMember[];
	vm_list: WorkshopVM[];
	longname: string = '';
	shortname: string = '';

	constructor(workshop?: Partial<Workshop>) {
		Object.assign(this, workshop);
		this.members = [];
		this.vm_list = [];
		if (workshop) {
			if (workshop.application) {
				this.application = new Application(workshop.application);
			}
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
		}
	}
}

export class WorkshopVM {
	vm: VirtualMachine;
	userlogin: string;
	elixirid: string;

	constructor(workshopvm?: Partial<WorkshopVM>) {
		Object.assign(this, workshopvm);
		if (workshopvm) {
			if (workshopvm.vm) {
				this.vm = new VirtualMachine(workshopvm.vm);
			}
		}
	}
}
