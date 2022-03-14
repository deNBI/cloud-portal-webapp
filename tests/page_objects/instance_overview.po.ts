// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-extraneous-dependencies
import { expect, Page } from '@playwright/test';
import { Util } from '../util';

/**
 * Instance Overview Page.
 */
export class InstanceOverviewPage {
	private VOLUMES_COUNT_PREFIX: string = 'volumes_count_';
	private RESENV_VISIBLE_PREFIX: string = 'resenv_visible_';
	private RESENV_URL_LINK_PREFIX: string = 'https://proxy-dev.bi.denbi.de/';
	private SHOW_ACTIONS_PREFIX: string = 'showActionsButton_';
	private HIDE_ACTIONS_PREFIX: string = 'hideActionsButton_';
	private STOP_VM_BUTTON_PREFIX: string = 'stopVMButton_';
	private REBOOT_VM_BUTTON_PREFIX: string = 'chooseRebootVMButton_';
	private RESUME_VM_BUTTON_PREFIX: string = 'restartVMButton_';
	private DELETE_VM_BUTTON_PREFIX: string = 'deleteVMButton_';
	private VERIFY_VM_STOP_BUTTON: string = 'verifyStopButton';
	private VERIFY_VM_RESUME_BUTTON: string = 'verifyRestartButton';
	private CHOOSE_SOFT_REBOOT_BUTTON_PREFIX: string = 'softRebootVM_';
	private VERIFY_REBOOT_BUTTON: string = 'verifyRebootButton';
	private VERIFY_DELETE_BUTTON: string = 'verifyDeleteButton';
	private DELETE_FILTER_CHECKBOX: string = 'deleteFilterCheckbox';
	private APPLY_FILTER_BUTTON: string = 'applyVMFilterButton';

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
		await this.page.waitForTimeout(timeout);
		console.log(`Waiting for VM ${vm_name} to be shown as active`);
		await this.page.waitForTimeout(timeout);
		await this.page.locator(`.active-machine:has-text("${vm_name}")`).isVisible();
		console.log(`VM ${vm_name} active`);
	}

	async waitForInstanceToBeShutoff(vm_name: string, timeout: number = 10000): Promise<any> {
		await this.page.waitForTimeout(timeout);
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
		await this.openVMActionsArea(vm_name);
		const locator_stop = this.page.locator(`.active-machine:has-text("${this.STOP_VM_BUTTON_PREFIX}${vm_name}")`);
		await expect(locator_stop).toBeVisible();
		await locator_stop.click();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_VM_STOP_BUTTON)).isVisible();
		await this.page.click(Util.by_data_test_id_str(this.VERIFY_VM_STOP_BUTTON));
		await this.waitForInstanceToBeShutoff(vm_name, 60000);

	}

	async resumeVirtualMachine(vm_name: string, timeout: number = 10000): Promise<void> {
		await this.page.waitForTimeout(timeout);
		console.log(`Resuming shutoff basic vm ${vm_name} on instance overview page`);
		await this.openVMActionsArea(vm_name);
		const locator_resume = this.page.locator(`.active-machine:has-text("${this.RESUME_VM_BUTTON_PREFIX}${vm_name}")`);
		await expect(locator_resume).toBeVisible();
		await locator_resume.click();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_VM_RESUME_BUTTON)).isVisible();
		await this.page.click(Util.by_data_test_id_str(this.VERIFY_VM_RESUME_BUTTON));
		await this.waitForInstanceToBeActive(vm_name, 60000);

	}

	async rebootVirtualMachine(vm_name: string, timeout: number = 10000): Promise<void> {
		await this.page.waitForTimeout(timeout);
		console.log(`Rebooting active basic vm ${vm_name} on instance overview page`);
		await this.openVMActionsArea(vm_name);
		const locator_reboot = this.page.locator(`.btn-primary:has-text("${this.REBOOT_VM_BUTTON_PREFIX}${vm_name}")`);
		await expect(locator_reboot).toBeVisible();
		await locator_reboot.click();
		const locator_soft = this.page.locator(`.btn-primary:has-text("${this.CHOOSE_SOFT_REBOOT_BUTTON_PREFIX}${vm_name}")`);
		await expect(locator_soft).toBeVisible();
		await locator_soft.click();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_VM_RESUME_BUTTON)).isVisible();
		await this.page.click(Util.by_data_test_id_str(this.VERIFY_VM_RESUME_BUTTON));
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_REBOOT_BUTTON)).isVisible();
		await this.page.click(Util.by_data_test_id_str(this.VERIFY_REBOOT_BUTTON));
		await this.waitForInstanceToBeActive(vm_name, 60000);
	}

	async deleteVirtualMachine(vm_name: string, timeout: number = 10000): Promise<void> {
		await this.page.waitForTimeout(timeout);
		console.log(`Deleting active basic vm ${vm_name} on instance overview page`);
		await this.openVMActionsArea(vm_name);
		const locator_delete = this.page.locator(`.active-machine:has-text("${this.DELETE_VM_BUTTON_PREFIX}${vm_name}")`);
		await expect(locator_delete).toBeVisible();
		await locator_delete.click();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_DELETE_BUTTON)).isVisible();
		await this.page.click(Util.by_data_test_id_str(this.VERIFY_DELETE_BUTTON));
		await this.page.waitForTimeout(30000);
		const locator_checkbox = this.page.locator(Util.by_data_test_id_str(this.DELETE_FILTER_CHECKBOX));
		const locator_apply = this.page.locator(Util.by_data_test_id_str(this.APPLY_FILTER_BUTTON));
		await expect(locator_checkbox).toBeVisible();
		await expect(locator_apply).toBeVisible();
		await locator_checkbox.click();
		await locator_apply.click();
		await this.waitForInstanceToBeDeleted(vm_name, 5000);
	}

	async detachVolume(vm_name: string, timeout: number = 10000): Promise<void> {
		await this.page.waitForTimeout(timeout);
		console.log(`Detaching volume from vm ${vm_name} on instance overview page`);
		await this.openVMActionsArea(vm_name);
		// TODO: check locators for actions, as these are not .active-machine
	}

	async openVMActionsArea(vm_name: string): Promise<void> {
		const locator_show = this.page.locator(`.active-machine:has-text("${this.SHOW_ACTIONS_PREFIX}${vm_name}")`);
		await expect(locator_show).toBeVisible();
		await locator_show.click();
		const locator_hide = this.page.locator(`.active-machine:has-text("${this.HIDE_ACTIONS_PREFIX}${vm_name}")`);
		await expect(locator_hide).toBeVisible();
	}
}
