// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-extraneous-dependencies
import { expect, Page } from '@playwright/test';
import { Util } from '../util';

/**
 * Instance Overview Page.
 */
export class InstanceOverviewPage {
	// GENERAL
	private RESENV_URL_LINK_PREFIX: string = 'https://proxy-dev.bi.denbi.de/';
	private RESENV_VISIBLE_PREFIX: string = 'resenv_visible_';
	private VOLUMES_COUNT_PREFIX: string = 'volumes_count_';

	// STATUS
	private ACTIVE_STATUS_PREFIX: string = 'active_';
	private SHUTOFF_STATUS_PREFIX: string = 'shutoff_';
	private DELETED_STATUS_PREFIX: string = 'deleted_';

	// ACTIONS
	private SHOW_ACTIONS_PREFIX: string = 'show_actions_button_';
	private SHOW_ATTACH_VOLUME_PREFIX: string = 'attach_volume_';
	private SHOW_DETACH_VOLUME_PREFIX: string = 'detach_volume_';
	private SHOW_STOP_VM_PREFIX: string = 'stop_vm_';
	private SHOW_RESTART_VM_PREFIX: string = 'restart_vm_';
	private SHOW_REBOOT_VM_PREFIX: string = 'reboot_vm_';
	private SHOW_DELETE_VM_PREFIX: string = 'delete_vm_';
	private SHOW_CREATE_SNAPSHOT_PREFIX: string = 'create_snapshot_';
	private VERIFY_VM_STOP_BUTTON: string = 'verifyStopButton';
	private VERIFY_VM_RESUME_BUTTON: string = 'verifyRestartButton';
	private VERIFY_REBOOT_BUTTON: string = 'verifyRebootButton';
	private VERIFY_DELETE_BUTTON: string = 'verifyDeleteButton';
	private SOFT_REBOOT_VM: string = 'soft_reboot_vm_';
	private VM_MESSAGE_ALERT: string = 'vm-message-alert';
	private VOLUME_DETACHMENT_DROPDOWN: string = 'volume_detachment_dropdown';
	private VOLUME_ATTACHMENT_DROPDOWN: string = 'volume_attachment_dropdown';
	private DETACH_VOLUME_BUTTON: string = 'detachVolumeButton';
	private ATTACH_VOLUME_BUTTON: string = 'attachVolumeButton';

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

	async waitForInstanceToBeActive(vm_name: string, timeout: number = 10000): Promise<boolean> {
		console.log(`Waiting for VM ${vm_name} to be shown as active`);
		const activeElement = await this.page.waitForSelector(
			Util.by_data_test_id_str_prefix(`${this.ACTIVE_STATUS_PREFIX}${vm_name}`),
			{
				state: 'visible',
				timeout,
			},
		);
		console.log(`VM ${vm_name} active`);

		return activeElement.isVisible();
	}

	async waitForInstanceToBeShutoff(vm_name: string, timeout: number = 10000): Promise<any> {
		console.log(`Waiting for VM ${vm_name} to be shown as shutoff`);
		await this.page.waitForSelector(Util.by_data_test_id_str_prefix(`${this.SHUTOFF_STATUS_PREFIX}${vm_name}`), {
			state: 'visible',
			timeout,
		});
		console.log(`VM ${vm_name} shutoff`);
	}

	async waitForInstanceToBeDeleted(vm_name: string, timeout: number = 10000): Promise<any> {
		console.log(`Waiting for VM ${vm_name} to be shown as deleted`);
		await this.page.waitForSelector(Util.by_data_test_id_str_prefix(`${this.DELETED_STATUS_PREFIX}${vm_name}`), {
			state: 'visible',
			timeout,
		});
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

	async showActions(vm_name: string): Promise<void> {
		console.log(`Showing actions of ${vm_name}`);
		await this.page.locator(Util.by_data_test_id_str_prefix(`${this.SHOW_ACTIONS_PREFIX}${vm_name}`)).click();
	}

	async stopVirtualMachine(vm_name: string, timeout: number = 10000): Promise<void> {
		console.log(`Stopping active basic vm ${vm_name} on instance overview page`);
		await this.showActions(vm_name);
		const locator_stop = this.page.locator(Util.by_data_test_id_str_prefix(`${this.SHOW_STOP_VM_PREFIX}${vm_name}`));
		await expect(locator_stop).toBeVisible();
		await locator_stop.click();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_VM_STOP_BUTTON)).isVisible();
		await Util.clickByDataTestIdStr(this.page,this.VERIFY_VM_STOP_BUTTON);
		await this.waitForInstanceToBeShutoff(vm_name, timeout);
	}

	async resumeVirtualMachine(vm_name: string, timeout: number = 10000): Promise<void> {
		console.log(`Resuming shutoff basic vm ${vm_name} on instance overview page`);
		await this.showActions(vm_name);
		const locator_resume = this.page.locator(
			Util.by_data_test_id_str_prefix(`${this.SHOW_RESTART_VM_PREFIX}${vm_name}`),
		);
		await expect(locator_resume).toBeVisible();
		await locator_resume.click();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_VM_RESUME_BUTTON)).isVisible();
		await Util.clickByDataTestIdStr(this.page,this.VERIFY_VM_RESUME_BUTTON);
		await this.waitForInstanceToBeActive(vm_name, timeout);
	}

	async rebootVirtualMachine(vm_name: string, timeout: number = 10000): Promise<void> {
		console.log(`Rebooting active basic vm ${vm_name} on instance overview page`);
		await this.showActions(vm_name);
		const locator_reboot = this.page.locator(Util.by_data_test_id_str_prefix(`${this.SHOW_REBOOT_VM_PREFIX}${vm_name}`));
		await expect(locator_reboot).toBeVisible();
		await locator_reboot.click();
		const locator_soft_reboot = this.page.locator(Util.by_data_test_id_str_prefix(`${this.SOFT_REBOOT_VM}${vm_name}`));
		await locator_soft_reboot.click();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_REBOOT_BUTTON)).isVisible();
		await Util.clickByDataTestIdStr(this.page,this.VERIFY_REBOOT_BUTTON);
		await this.page.waitForSelector(Util.by_data_test_id_str(this.VM_MESSAGE_ALERT), {
			state: 'visible',
			timeout,
		});
		const vm_message_alert_locator = this.page.locator(Util.by_data_test_id_str(this.VM_MESSAGE_ALERT));
		await expect(vm_message_alert_locator).toContainText('Reboot');
		console.log(`Rebooting message for vm ${vm_name} was shown.`);
		await this.waitForInstanceToBeActive(vm_name, timeout);
	}

	async deleteVirtualMachine(vm_name: string, timeout: number = 10000): Promise<void> {
		console.log(`Deleting active basic vm ${vm_name} on instance overview page`);
		await this.showActions(vm_name);
		const locator_delete = this.page.locator(Util.by_data_test_id_str_prefix(`${this.SHOW_DELETE_VM_PREFIX}${vm_name}`));
		await expect(locator_delete).toBeVisible();
		await locator_delete.click();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_DELETE_BUTTON)).isVisible();
		await Util.clickByDataTestIdStr(this.page,this.VERIFY_DELETE_BUTTON);
		await this.waitForInstanceToBeDeleted(vm_name, timeout);
	}

	async detachVolume(vm_name: string, timeout: number = 10000): Promise<void> {
		console.log(`Detaching volume from vm ${vm_name} on instance overview page`);
		await this.showActions(vm_name);
		const locator_detach = this.page.locator(
			Util.by_data_test_id_str_prefix(`${this.SHOW_DETACH_VOLUME_PREFIX}${vm_name}`),
		);
		await expect(locator_detach).toBeVisible({ timeout });
		await locator_detach.click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.VOLUME_DETACHMENT_DROPDOWN), {
			state: 'visible',
			timeout,
		});
		await this.page.selectOption(Util.by_data_test_id_str(this.VOLUME_DETACHMENT_DROPDOWN), { index: 1 });
		const locator_detach_button = this.page.locator(Util.by_data_test_id_str(this.DETACH_VOLUME_BUTTON));
		await expect(locator_detach_button).toBeEnabled({ timeout: 1000 });
		await locator_detach_button.click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.VM_MESSAGE_ALERT), {
			state: 'visible',
			timeout,
		});
		const vm_message_alert_locator = this.page.locator(Util.by_data_test_id_str(this.VM_MESSAGE_ALERT));
		await expect(vm_message_alert_locator).toContainText('detached', { timeout: 1000 });
		console.log(`Detachment message for volume from vm ${vm_name} was shown.`);
	}

	async attachVolume(vm_name: string, timeout: number = 10000): Promise<void> {
		console.log(`Attach volume from vm ${vm_name} on instance overview page`);
		await this.showActions(vm_name);
		const locator_attach = this.page.locator(
			Util.by_data_test_id_str_prefix(`${this.SHOW_ATTACH_VOLUME_PREFIX}${vm_name}`),
		);
		await expect(locator_attach).toBeVisible();
		await locator_attach.click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.VOLUME_ATTACHMENT_DROPDOWN), {
			state: 'visible',
			timeout,
		});
		await this.page.selectOption(Util.by_data_test_id_str(this.VOLUME_ATTACHMENT_DROPDOWN), { index: 1 });
		const locator_attach_button = this.page.locator(Util.by_data_test_id_str(this.ATTACH_VOLUME_BUTTON));
		await expect(locator_attach_button).toBeEnabled({ timeout: 1000 });
		await locator_attach_button.click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.VM_MESSAGE_ALERT), {
			state: 'visible',
			timeout,
		});
		const vm_message_alert_locator = this.page.locator(Util.by_data_test_id_str(this.VM_MESSAGE_ALERT));
		await expect(vm_message_alert_locator).toContainText('attached', { timeout: 1000 });
		console.log(`Attachment message for volume from vm ${vm_name} was shown.`);
	}

	async expectWorkshopMachines(amount: number): Promise<string[]> {
		await this.page.waitForTimeout(2000);
		const vms = this.page.locator(Util.by_data_test_id_str_prefix(`detail${Util.WORKSHOP_NAME}`));
		console.log(vms);
		await expect(vms).toHaveCount(amount);

		return await vms.allTextContents();
	}
}
