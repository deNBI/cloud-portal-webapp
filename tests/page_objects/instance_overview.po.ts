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
		// await this.page.reload({ waitUntil: 'networkidle' });
		console.log(`Waiting for VM ${vm_name} to be shown as active`);
		await this.page.waitForTimeout(timeout);
		await this.page.locator(`.active-machine:has-text("${vm_name}")`).isVisible();
		console.log(`VM ${vm_name} active`);
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
}
