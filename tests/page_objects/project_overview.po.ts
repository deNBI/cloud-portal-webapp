import { expect, Page } from '@playwright/test';
import { Util } from '../util';

/**
 * Project overview page object.
 */
export class ProjectOverViewPage {
	private SIMPLE_VM_PROJECT_OVERVIEW_BUTTON_PREFIX: string = 'simple_vm_project_overview_';
	private OPENSTACK_PROJECT_OVERVIEW_BUTTON_PREFIX: string = 'openstack_project_overview_';
	private OPEN_EXTENSION_REQUEST_BUTTON: string = 'open_extension_request_button';
	private OPEN_MODIFICATION_REQUEST_BUTTON: string = 'open_modification_request_button';
	private DECLINE_NEW_PUBLICATION_BUTTON: string = 'decline_publication_button';
	private PROJECT_EXTENSION_MONTHS_INPUT: string = 'project_extension_months_input';
	private SUBMIT_EXTENSION_REQUEST_BUTTON: string = 'submit_extension_request_button';
	private SUBMIT_MODIFICATION_REQUEST_BUTTON: string = 'submit_modification_request_button';
	private CONFIRM_EXTENSION_REQUEST_BUTTON: string = 'confirm_extension_request_button';
	private CONFIRM_MODIFICATION_REQUEST_BUTTON: string = 'confirm_modification_request_button';
	private EXTENSION_REQUESTED_SUCCESSFULLY: string = 'Lifetime extension request successfully submitted!';
	private MODIFICATION_REQUESTED_SUCCESSFULLY: string = 'Modification request successfully submitted!';
	private EXTENSION_REQUEST_RESULT_DIV: string = 'extension_request_result_div';
	private MODIFICATION_REQUEST_RESULT_DIV: string = 'modification_request_result_div';
	private CREDIT_REQUEST_RESULT_DIV: string = 'credit_request_result_div';
	private NUMBER_MODIFICATION_FLAVORS: string = '7';
	private NUMBER_MODIFICATION_VOLUMES: string = '5';
	private MODIFICATION_REQUEST_VOLUME_COUNTER_INPUT: string = 'modification_request_volume_counter_input';
	private MODIFICATION_REQUEST_VOLUME_LIMIT_INPUT: string = 'modification_request_volume_limit_input';
	private MODIFICATION_REQUEST_OBJECT_STORAGE_INPUT: string = 'modification_request_object_storage_input';

	private SITE_LOADER: string = 'site-loader';

	readonly page: Page;
	readonly baseURL: string;

	constructor(page: Page, baseURL) {
		this.page = page;
		this.baseURL = baseURL;
	}

	async goToOpenStackProjectOverview() {
		console.log('Goto Project overview Page for OpenStack Project');
		await this.page.waitForSelector(
			`data-test-id=${this.OPENSTACK_PROJECT_OVERVIEW_BUTTON_PREFIX + Util.OPENSTACK_APPLICATION_NAME}`,
		);
		await this.page
			.locator(
				Util.by_data_test_id_str(this.SIMPLE_VM_PROJECT_OVERVIEW_BUTTON_PREFIX + Util.OPENSTACK_APPLICATION_NAME),
			)
			.click();
		console.log(this.page.url());
		expect(this.page.url()).toContain('/project-management');
		await this.page.waitForSelector(Util.by_data_test_id_str(this.SITE_LOADER), { state: 'hidden' });
	}

	async goToSimpleVMProjectOverview() {
		console.log('Goto Project overview Page for Simple VM Project');
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
	}

	async requestProjectExtension(simpleVM: boolean) {
		// eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
		simpleVM
			? console.log('Filling extension formular and requesting extension for SimpleVM project')
			: console.log('Filling extension formular and requesting extension for Openstack project');
		await this.page.locator(Util.by_data_test_id_str(this.OPEN_EXTENSION_REQUEST_BUTTON)).click();
		await this.page.locator(Util.by_data_test_id_str(this.DECLINE_NEW_PUBLICATION_BUTTON)).click();
		await this.page.waitForSelector(`data-test-id=${this.PROJECT_EXTENSION_MONTHS_INPUT}`);
		await this.page.fill(Util.by_data_test_id_str(this.PROJECT_EXTENSION_MONTHS_INPUT), '3');
		await this.page.locator(Util.by_data_test_id_str(this.SUBMIT_EXTENSION_REQUEST_BUTTON)).click();
		await this.page.locator(Util.by_data_test_id_str(this.CONFIRM_EXTENSION_REQUEST_BUTTON)).click();
		await this.page.waitForSelector(
			`data-test-id=${this.EXTENSION_REQUEST_RESULT_DIV} >> text=${this.EXTENSION_REQUESTED_SUCCESSFULLY}`,
		);
	}

	async requestProjectModification(simpleVM: boolean) {
		// eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
		simpleVM
			? console.log('Filling modification formular and requesting extension for SimpleVM project')
			: console.log('Filling modification formular and requesting extension for Openstack project');
		await this.page.locator(Util.by_data_test_id_str(this.OPEN_MODIFICATION_REQUEST_BUTTON)).click();
		await this.page.fill(Util.by_data_test_id_str('std_1'), this.NUMBER_MODIFICATION_FLAVORS);
		await this.page.fill(
			Util.by_data_test_id_str(this.MODIFICATION_REQUEST_VOLUME_COUNTER_INPUT),
			this.NUMBER_MODIFICATION_VOLUMES,
		);
		await this.page.fill(Util.by_data_test_id_str(this.MODIFICATION_REQUEST_VOLUME_LIMIT_INPUT), '25');
		if (!simpleVM) {
			await this.page.fill(Util.by_data_test_id_str(this.MODIFICATION_REQUEST_OBJECT_STORAGE_INPUT), '25');
		}
		await this.page.locator(Util.by_data_test_id_str(this.SUBMIT_MODIFICATION_REQUEST_BUTTON)).click();
		await this.page.locator(Util.by_data_test_id_str(this.CONFIRM_MODIFICATION_REQUEST_BUTTON)).click();
		await this.page.waitForSelector(
			`data-test-id=${this.MODIFICATION_REQUEST_RESULT_DIV} >> text=${this.MODIFICATION_REQUESTED_SUCCESSFULLY}`,
		);
	}
}
