import { VirtualMachine } from '../virtualmachinemodels/virtualmachine';
import { UrlData } from './workshop-urlinfo.model';

export class WorkshopVM {
	vm: VirtualMachine;
	userlogin: string;
	elixirid: string;
	urlData: UrlData;
	loadingUrlData: boolean = false;

	constructor(workshopvm?: Partial<WorkshopVM>) {
		Object.assign(this, workshopvm);
		if (workshopvm) {
			if (workshopvm.vm) {
				this.vm = new VirtualMachine(workshopvm.vm);
			}
			if (workshopvm.urlData) {
				this.urlData = new UrlData(workshopvm.urlData);
			}
		}
	}

	setUrlData(urlData: UrlData): void {
		this.urlData = urlData;
	}

	setLoadingUrlData(loading: boolean): void {
		this.loadingUrlData = loading;
	}
}
