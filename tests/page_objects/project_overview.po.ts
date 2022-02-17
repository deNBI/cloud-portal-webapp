import { expect, Page } from '@playwright/test';
import { Util } from '../util';

/**
 * Project overview page object.
 */
export class ProjectOverViewPage {
	private SIMPLE_VM_PROJECT_OVERVIEW_BUTTON_PREFIX: string = 'simple_vm_project_overview_';
	private SITE_LOADER: string = 'site-loader';

	readonly page: Page;
	readonly baseURL: string;

	constructor(page: Page, baseURL) {
		this.page = page;
		this.baseURL = baseURL;
	}

	async goToSimpleVMProjectOverview() {
		console.log('Goto Project overview Page');
		await this.page.waitForSelector(
			`data-test-id=${this.SIMPLE_VM_PROJECT_OVERVIEW_BUTTON_PREFIX + Util.SIMPLE_VM_APPLICATION_NAME}`,
		);
		await this.page
			.locator(
				Util.by_data_test_id_str(this.SIMPLE_VM_PROJECT_OVERVIEW_BUTTON_PREFIX + Util.SIMPLE_VM_APPLICATION_NAME),
			)
			.click();
		console.log(this.page.url());
		expect(this.page.url()).toContain('/project-management');
		await this.page.waitForSelector(Util.by_data_test_id_str(this.SITE_LOADER), { state: 'hidden' });
		console.log('i am on');
	}

	async requestProjectExtension(simpleVM: boolean) {
		// eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
		simpleVM
			? console.log('Filling extension formular and requesting extension for SimpleVM project')
			: console.log('Filling extension formular and requesting extension for Openstack project');
	}
}
