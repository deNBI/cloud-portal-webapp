// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-extraneous-dependencies
import {expect, Locator, Page} from '@playwright/test';
import { Util } from '../util';

/**
 * Instance Overview Page.
 */
export class InstanceOverviewPage {
	private VOLUMES_COUNT_PREFIX: string = 'volumes_count_';
	private RESENV_VISIBLE_PREFIX: string = 'resenv_visible_';
	private RESENV_URL_LINK_PREFIX: string = 'https://proxy-dev.bi.denbi.de/';
	private VERIFY_VM_STOP_BUTTON: string = 'verifyStopButton';
	private VERIFY_VM_RESUME_BUTTON: string = 'verifyRestartButton';
	private VERIFY_REBOOT_BUTTON: string = 'verifyRebootButton';
	private VERIFY_DELETE_BUTTON: string = 'verifyDeleteButton';
	private VM_MESSAGE_ALERT: string = 'vm-message-alert';

	readonly page: Page;
	readonly baseURL: string;

	constructor(page: Page, baseURL) {
		this.page = page;
		this.baseURL = baseURL;
	}

	async goto() {
		console.log('Goto Instance Overview Page');
		await this.page.goto(`${this.baseURL}/#/virtualmachines/vmOverview`, { waitUntil: 'networkidle' });
		console.log(this.page.url());
		expect(this.page.url()).toContain('/vmOverview');
	}

	async waitForInstanceToBeActive(vm_name: string, timeout: number = 10000): Promise<any> {
		console.log(`Waiting for VM ${vm_name} to be shown as active`);
		await this.page.waitForTimeout(timeout);
		await this.page.locator(`.active-machine:has-text("${vm_name}")`).isVisible();
		console.log(`VM ${vm_name} active`);
	}

	async waitForInstanceToBeShutoff(vm_name: string, timeout: number = 10000): Promise<any> {
		console.log(`Waiting for VM ${vm_name} to be shown as shutoff`);
		await this.page.waitForTimeout(timeout);
		await this.page.locator(`.shutoff-machine:has-text("${vm_name}")`).isVisible();
		console.log(`VM ${vm_name} shutoff`);
	}

	async waitForInstanceToBeDeleted(vm_name: string, timeout: number = 10000): Promise<any> {
		console.log(`Waiting for VM ${vm_name} to be shown as deleted`);
		await this.page.waitForTimeout(timeout);
		await this.page.locator(`.deleted-machine:has-text("${vm_name}")`).isVisible();
		console.log(`VM ${vm_name} deleted`);
	}

	async waitForInstanceToHaveVolumeAttached(vm_name: string): Promise<void> {
		console.log(`Check if ${vm_name} has one volume attached`);
		const locator = this.page.locator(Util.by_data_test_id_str_prefix(`${this.VOLUMES_COUNT_PREFIX}${vm_name}`));
		await expect(locator).toContainText('1');
	}

	async waitForInstanceToHaveResenv(vm_name: string): Promise<void> {
		console.log(`Check if ${vm_name} has resenv`);
		const locator = this.page.locator(Util.by_data_test_id_str_prefix(`${this.RESENV_VISIBLE_PREFIX}${vm_name}`));
		await expect(locator).toBeVisible();
	}

	async stopVirtualMachine(vm_name: string, timeout: number = 10000): Promise<void> {
		await this.page.waitForTimeout(timeout);
		console.log(`Stopping active basic vm ${vm_name} on instance overview page`);
		let locator_actions;
		await this.openVMActionsArea(vm_name).then(result => {
			locator_actions = result;
		});
		const locator_stop_col = locator_actions.locator('.col-md-2:has(.btn-outline-secondary:has-text("Stop VM"))');
		const locator_stop = locator_stop_col.locator('.btn-outline-secondary:has-text("Stop VM")');
		await expect(locator_stop).toBeVisible();
		await locator_stop.click();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_VM_STOP_BUTTON)).isVisible();
		await this.page.click(Util.by_data_test_id_str(this.VERIFY_VM_STOP_BUTTON));
		await this.waitForInstanceToBeShutoff(vm_name, 2 * 60000);

	}

	async resumeVirtualMachine(vm_name: string, timeout: number = 10000): Promise<void> {
		console.log(`Resuming shutoff basic vm ${vm_name} on instance overview page`);
		let locator_actions;
		await this.openVMActionsArea(vm_name).then(result => {
			locator_actions = result;
		});
		const locator_resume_col = locator_actions.locator('.col-md-2:has(.btn-outline-secondary:has-text("Start VM"))');
		const locator_resume = locator_resume_col.locator('.btn-outline-secondary:has-text("Start VM")');
		await expect(locator_resume).toBeVisible();
		await locator_resume.click();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_VM_RESUME_BUTTON)).isVisible();
		await this.page.click(Util.by_data_test_id_str(this.VERIFY_VM_RESUME_BUTTON));
		await this.waitForInstanceToBeActive(vm_name, 12 * timeout);

	}

	async rebootVirtualMachine(vm_name: string, timeout: number = 10000): Promise<void> {
		console.log(`Rebooting active basic vm ${vm_name} on instance overview page`);
		let locator_actions;
		await this.openVMActionsArea(vm_name).then(result => {
			locator_actions = result;
		});
		const locator_reboot_col = locator_actions.locator('.col-md-2:has(.btn-outline-secondary:has-text("Reboot VM"))');
		const locator_reboot = locator_reboot_col.locator('.btn-outline-secondary:has-text("Reboot VM")');
		await expect(locator_reboot).toBeVisible();
		await locator_reboot.click();
		const locator_soft_reboot = this.page.locator('.btn-primary:has-text("Soft Reboot") >> visible=true');
		await locator_soft_reboot.click();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_REBOOT_BUTTON)).isVisible();
		await this.page.click(Util.by_data_test_id_str(this.VERIFY_REBOOT_BUTTON));
		await this.page.waitForSelector(Util.by_data_test_id_str(this.VM_MESSAGE_ALERT));
		const vm_message_alert_locator = this.page.locator(Util.by_data_test_id_str(this.VM_MESSAGE_ALERT));
		await expect(vm_message_alert_locator).toContainText('Reboot');
		console.log(`Rebooting message for vm ${vm_name} was shown.`);
		await this.waitForInstanceToBeActive(vm_name, 3 * timeout);
	}

	async deleteVirtualMachine(vm_name: string, timeout: number = 10000): Promise<void> {
		console.log(`Deleting active basic vm ${vm_name} on instance overview page`);
		let locator_actions;
		await this.openVMActionsArea(vm_name).then(result => {
			locator_actions = result;
		});
		const locator_delete_col = locator_actions.locator('.col-md-2:has(.btn-outline-secondary:has-text("Delete VM"))');
		const locator_delete = locator_delete_col.locator('.btn-outline-secondary:has-text("Delete VM")');
		await expect(locator_delete).toBeVisible();
		await locator_delete.click();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_DELETE_BUTTON)).isVisible();
		await this.page.click(Util.by_data_test_id_str(this.VERIFY_DELETE_BUTTON));
		await this.page.waitForTimeout(30000);
		await this.waitForInstanceToBeDeleted(vm_name, 5000);
	}

	async detachVolume(vm_name: string, timeout: number = 10000): Promise<void> {
		await this.page.waitForTimeout(timeout);
		console.log(`Detaching volume from vm ${vm_name} on instance overview page`);
		await this.openVMActionsArea(vm_name);
		// TODO: check locators for actions, as these are not .active-machine
	}

	async openVMActionsArea(vm_name: string): Promise<Locator> {
		const locator_instance = this.page.locator(`.instance-card:has(.card-block:has(.active-machine:has-text("${vm_name}"))), .instance-card:has(.card-block:has(.shutoff-machine:has-text("${vm_name}")))`);
		const locator_card_body = locator_instance.locator('.card-body');
		const locator_card_row = locator_card_body.locator('.row');
		const locator_card_col = locator_card_row.locator('.col-4 ');
		const locator_show = locator_card_col.locator('.btn-outline-secondary:has-text("Show actions")');
		await expect(locator_show).toBeVisible();
		await locator_show.click();
		const locator_footer = locator_instance.locator('.card-footer');
		const locator_inserted = locator_footer.locator('div');
		const locator_action_row = locator_inserted.locator('.row');

		return locator_action_row;
	}
}
