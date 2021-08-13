import { VirtualMachine } from './virtualmachine';

export class VirtualMachinePage {
	vm_list: VirtualMachine[];
	total_pages: number = 0;
	total_items: number = 0;
	items_per_page: number = 7;
	num_pages: number = 0;

	constructor(vm_page?: Partial<VirtualMachinePage>) {
		Object.assign(this, vm_page);
		this.vm_list = [];
		if (vm_page) {
			for (const vm of vm_page.vm_list) {
				this.vm_list.push(new VirtualMachine(vm));
			}
			if (vm_page.num_pages) {
				this.total_pages = vm_page.num_pages;
			}
			if (vm_page.total_pages) {
				this.num_pages = vm_page.total_pages;
			}
		}
	}
}
