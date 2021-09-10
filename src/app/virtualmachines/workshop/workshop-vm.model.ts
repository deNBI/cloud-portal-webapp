import { VirtualMachine } from '../virtualmachinemodels/virtualmachine';

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
