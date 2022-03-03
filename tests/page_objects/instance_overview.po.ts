// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-extraneous-dependencies
import {Page, expect, test} from '@playwright/test';
import { Util } from '../util';

/**
 * Instance Overview Page.
 */
export class InstanceOverviewPage {

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

	async waitForNormalInstanceToBeActive(): Promise<any> {
		await this.page.waitForTimeout(60000);
		await this.page.reload({ waitUntil: 'networkidle' });
		console.log('Waiting for VM to be shown as active');
		await this.page.waitForTimeout(10000);
		await this.page.locator('div:has(.pulseAnim) >> has-text("PTSimpleVMnormal")').isVisible();
		console.log('VM active');
	}

	async waitForVolumeInstanceToBeActive(): Promise<any> {
		// TODO: check how to get volume information
		await this.page.waitForTimeout(30000);
		await this.page.reload({ waitUntil: 'networkidle' });
		console.log('Waiting for VM with volume to be shown as active');
		const test_elem = await this.page.locator('div:has(.pulseAnim) >> has-text("PTSimpleVMvolume")');
		const second_test_elem = this.page.$('div:has(.pulseAnim) >> has-text("PTSimpleVMvolume")');
		console.log(test_elem)
		console.log(second_test_elem);

	}





}
