import { browser, by, element } from 'protractor';
import { Util } from '../util';

/**
 * Instance Overview Page.
 */
export class VMOverviewPage {

	private VM_OVERVIEW_URL: string = 'virtualmachines/vmOverview';
	private TABLE_ID: string = 'vm_overview_table';
	private SHOW_ACTIONS_PREFIX: string = 'showActionsButton_';
	private ACTIVE_BADGE_PREFIX: string = 'active_badge_';
  private SHUTOFF_BADGE_PREFIX: string = 'shutoff_badge_';
  private DELETED_BADGE_PREFIX: string = 'deleted_badge_';
  private CHECKBOX_DELETED: string = 'checkbox_deleted';
  private VERIFY_STOP_BTN: string = 'verifyStopButton';
  private VERIFY_RESTART_BTN: string = 'verifyRestartButton';
  private DETAIL_PRE: string = 'showDetailsButton_';
  private DETAIL_LINK: string = 'detail_';

  private SHUTOFF_BUTTON_PREFIX: string = 'stopVMButton_';
  private RESUME_BUTTON_PREFIX: string = 'restartVMButton_';
  private DELETE_BUTTON_PREFIX: string = 'deleteVMButton_';
	private SNAPSHOT_BUTTON_PREFIX: string = 'createSnapshotVMButton_';

	private SNAPSHOT_NAME_MODAL: string = 'snapshot_name_modal';
	private SNAPSHOT_NAME_INPUT: string = 'snapshot_name_input';
	private SNAPSHOT_CREATE_BUTTON: string = 'snapshot_create_modal_button';
	private SNAPSHOT_RESULT_MODAL: string = 'snapshot_result_modal';
	private SNAPSHOT_DONE_DIV: string = 'snapshot_done';
	private CLOSE_SNAPSHOT_RESULT_BUTTON: string = 'snapshot_result_modal_close';

	private VERIFY_MODAL: string = 'verify_modal';
	private CONFIRM_DELETE_BUTTON: string = 'confirm_delete_button';

	private VERIFY_RESTART_MODAL: string = 'submitRestartModal';
	private SUBMIT_STOP_MODAL: string = 'submitStopVmModal';

	private BASIC_VM_NAME_KEY: string = 'basic_vm_name';
	private VOLUME_VM_NAME_KEY: string = 'volume_vm_name';
	private static vm_names: { [key: string]: string } = {};
	private static name_counter: number = 0;

	async navigateToOverview(): Promise<any> {
		Util.logInfo('Navigating to VM Overview Page');
		await Util.navigateToAngularPage(this.VM_OVERVIEW_URL);
		await Util.waitForPage(this.VM_OVERVIEW_URL);

		return await browser.driver.sleep(10000);
	}

	static async getAllWorkshopMachines(): Promise<string[]> {
		return Util.getTextFromElementsByIdPrefix(`detail_${Util.WORKSHOP_NAME}`);
	}

	static async logVmNames(): Promise<void> {
		Util.logInfo(`Name_Counter: ${VMOverviewPage.name_counter}`);

		Util.logInfo('VM Names:');
		for (const key in VMOverviewPage.vm_names) {
			const val: any = VMOverviewPage.vm_names[key];
			console.log(`\tKey: ${key} Value: ${val}`);

		}
	}

	async setBasicVMName(name: string): Promise<any> {
		Util.logInfo(`Setting basic vm name as ${name}`);
		VMOverviewPage.vm_names[this.BASIC_VM_NAME_KEY] = name;
		VMOverviewPage.name_counter += 1;
		await VMOverviewPage.logVmNames();

	}

	async setVolumeVMName(name: string): Promise<any> {
		Util.logInfo(`Setting volume vm name as ${name}`);
		VMOverviewPage.vm_names[this.VOLUME_VM_NAME_KEY] = name;
		VMOverviewPage.name_counter += 1;
		await VMOverviewPage.logVmNames();

	}

	async isVmActive(name: string): Promise<boolean> {
		Util.logInfo(`Checking if ${name} is active`);
		await Util.waitForPresenceOfElementById(this.TABLE_ID);

		return await Util.waitForPresenceOfElementById(`${this.ACTIVE_BADGE_PREFIX}${name}`, Util.MIN_TIMEOUT_15);
	}

	async isBasicVMActive(): Promise<boolean> {
		return await this.isVmActive(VMOverviewPage.vm_names[this.BASIC_VM_NAME_KEY]);
	}

	async areAllVMActive(): Promise<boolean> {
		Util.logInfo(`Checking active for ${VMOverviewPage.name_counter} active vm`);

		for (const key in VMOverviewPage.vm_names) {
			if (key in VMOverviewPage.vm_names) {
				const val: any = VMOverviewPage.vm_names[key];
				console.log(`Key: ${key} Value: ${val}`);
				if (!await this.isVmActive(val)) {
					return false;
				}
			}
		}

		return true;
	}

	async isVMShutoff(name: string): Promise<boolean> {
		Util.logInfo(`Checking if ${name} is shutoff`);
		await Util.waitForPresenceOfElementById(this.TABLE_ID);

		return await Util.waitForPresenceOfElementById(`${this.SHUTOFF_BADGE_PREFIX}${name}`, Util.MIN_TIMEOUT_15);
	}

	async isBasicVMShutoff(): Promise<boolean> {
		return await this.isVMShutoff(VMOverviewPage.vm_names[this.BASIC_VM_NAME_KEY]);
	}

	async showDeleted(): Promise<any> {
		console.log('Showing all deleted VM');
		await Util.clickElementById(this.CHECKBOX_DELETED);
	}

	async isVMDeleted(name: string): Promise<boolean> {
		Util.logInfo(`Checking if ${name} is deleted`);

		await Util.waitForPresenceOfElementById(this.TABLE_ID);

		return await Util.waitForPresenceOfElementById(`${this.DELETED_BADGE_PREFIX}${name}`);
	}

	async isBasicVMDeleted(): Promise<boolean> {
		return await this.isVMDeleted(VMOverviewPage.vm_names[this.BASIC_VM_NAME_KEY]);
	}

	async isVolumeVMDeleted(): Promise<boolean> {
		return await this.isVMDeleted(VMOverviewPage.vm_names[this.VOLUME_VM_NAME_KEY]);
	}

	async shutoffVM(name: string): Promise<any> {
		Util.logInfo(`Shutting off ${name}`);
		await Util.waitForPresenceOfElementById(`${this.ACTIVE_BADGE_PREFIX}${name}`);
		await Util.clickElementById(`${this.SHOW_ACTIONS_PREFIX}${name}`);
		await Util.clickElementById(`${this.SHUTOFF_BUTTON_PREFIX}${name}`);
		await Util.waitForPresenceOfElementById(this.SUBMIT_STOP_MODAL);
		await Util.clickElementById(this.VERIFY_STOP_BTN);
		await browser.sleep(1000);

		Util.logInfo(`Shutoff method for ${name} completed`);
	}

	async shutOffBasicVM(): Promise<any> {
		return await this.shutoffVM(VMOverviewPage.vm_names[this.BASIC_VM_NAME_KEY]);
	}

	async resumeVM(name: string): Promise<any> {
		Util.logInfo(`Resume vm ${name}`);
		await Util.waitForPresenceOfElementById(`${this.SHUTOFF_BADGE_PREFIX}${name}`);
		await Util.clickElementById(`${this.SHOW_ACTIONS_PREFIX}${name}`);
		await Util.clickElementById(`${this.RESUME_BUTTON_PREFIX}${name}`);
		await Util.waitForPresenceOfElementById(this.VERIFY_RESTART_MODAL);
		await Util.clickElementById(this.VERIFY_RESTART_BTN);
		await browser.sleep(1000);
		Util.logInfo(`Resuming method for ${name} completed`);
	}

	async resumeBasicVM(): Promise<any> {
		return await this.resumeVM(VMOverviewPage.vm_names[this.BASIC_VM_NAME_KEY]);
	}

	async getBasicVMName(): Promise<string> {
		if (VMOverviewPage.vm_names[this.BASIC_VM_NAME_KEY]) {
			return VMOverviewPage.vm_names[this.BASIC_VM_NAME_KEY];
		} else {
			return '';
		}
	}

	async getNewBasicVMName(): Promise<string> {
		return await Util.getTextFromLinkElement(this.DETAIL_LINK, Util.BASIC_VM_NAME);

	}

	async getNewVolumeVMName(): Promise<string> {
		return await Util.getTextFromLinkElement(this.DETAIL_LINK, Util.VOLUME_VM_NAME);

	}

	async getVolumeVMName(): Promise<string> {
		if (VMOverviewPage.vm_names[this.VOLUME_VM_NAME_KEY]) {
			return VMOverviewPage.vm_names[this.VOLUME_VM_NAME_KEY];
		} else {
			return '';
		}
	}

	static async removeNameFromVmNames(key_or_val: string): Promise<void> {
		Util.logInfo(`Check to remove ${key_or_val} from vm names`);
		if (key_or_val in VMOverviewPage.vm_names) {
			delete VMOverviewPage.vm_names[key_or_val];
			VMOverviewPage.name_counter -= 1;
			await VMOverviewPage.logVmNames();

			return;

		} else {
			for (const key in VMOverviewPage.vm_names) {
				const val: any = VMOverviewPage.vm_names[key];
				if (val === key_or_val) {
					delete VMOverviewPage.vm_names[key];
					VMOverviewPage.name_counter -= 1;
					Util.logInfo(`Removed ${key}:${val} from vm_names`);
					await VMOverviewPage.logVmNames();

					return;
				}

			}
		}
		await VMOverviewPage.logVmNames();

		Util.logInfo(`${key_or_val}  not found in vm_names`);

	}

	async deleteVM(name: string): Promise<any> {
		Util.logInfo(`Deleting ${name}`);
		if (element(by.id(`${this.SHOW_ACTIONS_PREFIX}${name}`)).isPresent()) {
			await Util.clickElementById(`${this.SHOW_ACTIONS_PREFIX}${name}`);
		}

		await Util.clickElementById(`${this.DELETE_BUTTON_PREFIX}${name}`);
		await Util.waitForPresenceOfElementById(this.VERIFY_MODAL);
		await Util.clickElementById(this.CONFIRM_DELETE_BUTTON);
		await Util.waitForPresenceOfElementById(`${this.DELETED_BADGE_PREFIX}${name}`, Util.MIN_TIMEOUT_15);
		Util.logInfo(`Remove  ${name}  from vm list `);
		await VMOverviewPage.removeNameFromVmNames(name);

		Util.logInfo(`Deletion method for ${name} completed`);
	}

	async deleteBasicVM(): Promise<any> {
		return await this.deleteVM(VMOverviewPage.vm_names[this.BASIC_VM_NAME_KEY]);
	}

	async deleteVolumeVM(): Promise<any> {
		return await this.deleteVM(VMOverviewPage.vm_names[this.VOLUME_VM_NAME_KEY]);
	}

	async createSnapshotOfVM(name: string): Promise<any> {
		Util.logInfo(`Creating snapshot of ${name}`);

		if (element(by.id(`${this.SHOW_ACTIONS_PREFIX}${name}`)).isPresent()) {
			await Util.clickElementById(`${this.SHOW_ACTIONS_PREFIX}${name}`);
		}
		await Util.clickElementById(`${this.SNAPSHOT_BUTTON_PREFIX}${name}`);
		await Util.waitForPresenceOfElementById(this.SNAPSHOT_NAME_MODAL);
		await Util.sendTextToElementByIdUnsecure(this.SNAPSHOT_NAME_INPUT, Util.BASIC_SNAPSHOT_NAME);
		await Util.clickElementById(this.SNAPSHOT_CREATE_BUTTON);
		await this.isVmActive(name);
		// await Util.waitForPresenceOfElementById(this.SNAPSHOT_RESULT_MODAL);
		// await Util.waitForPresenceOfElementById(this.SNAPSHOT_DONE_DIV);
		// await Util.clickElementById(this.CLOSE_SNAPSHOT_RESULT_BUTTON);
		Util.logInfo(`Creating snapshot method for ${name} completed`);
	}

	async createSnapshotOfBasicVM(): Promise<any> {
		return await this.createSnapshotOfVM(VMOverviewPage.vm_names[this.BASIC_VM_NAME_KEY]);

	}

	async goToVmDetail(): Promise<any> {
		const vm_name: string = await this.getBasicVMName();

		await this.isVmActive(vm_name);
		Util.logInfo(`Going to VM Detail page for ${VMOverviewPage.vm_names[this.BASIC_VM_NAME_KEY]}`);

		return await Util.clickElementById(`${this.DETAIL_LINK}${vm_name}`);
	}

}
