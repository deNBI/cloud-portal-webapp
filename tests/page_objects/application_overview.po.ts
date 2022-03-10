import { expect, Page } from '@playwright/test';
import { Util } from '../util';

/**
 * Applicationoverview page object.
 */
export class ApplicationOverviewPage {
	private OWN_APPLICATION_ID: string = 'own_applications';
	private EXTENSION_RESULT: string = 'notification_message';
	private EXTENSION_SV_SUCCESSFULLY_APPROVED: string = 'Modify request successfully approved!';
	private EXTENSION_OP_SUCCESFULLY_APPROVED: string = 'Modify request successfully approved and forwarded to facility!';
	private PROJECT_FACILITY_ASSIGNED: string = 'The project was assigned to the facility.';

	private EXTENSION_APPROVAL_BTN_PREFIX: string = 'extension_approval_';
	private COMPUTE_CENTER_SELECTION_PREFIX: string = 'id_compute_center_option_';
	private DEFAULT_DENBI_COMPUTE_CENTER: string = 'de.NBI Cloud Portal - Development';
	private CLOUD_PROJECT_CREATED: string = 'The new project was created';
	private SIMPLE_VM_CREATED: string = 'The project was created!';
	private NOTIFICATION_MESSAGE: string = 'notification_modal_message';
	private NOTIFICATION_MODAL_TITLE: string = 'notification_modal_title';
	private APPROVAL_PREFIX: string = 'approve_';
	private APPROVAL_CLIENT_LIMIT_PREFIX: string = 'approve_client_limit_';
	private MODIFICATION_TAB_BUTTON: string = 'modification_requests_applications_tab';
	private MODIFICATION_APPROVAL_BTN_PREFIX: string = 'modification_approval_';
	private MODIFICATION_REQUEST_RESULT_TEXT: string = 'The resource modification request was approved!';
	private EXTENSION_TAB_BUTTON: string = 'extension_requests_applications_tab';
	private EXTENSION_RESULT_SIMPLEVM_TEXT: string = 'The project has been extended!';
	private EXTENSION_RESULT_OPENSTACK_TEXT: string = 'The request has been sent to the facility manager.';
	private DECLINE_OPEN_APPLICATION_PRE: string = 'btn_decline_';
	private SUCCESSFULL_DECLINED: string = 'The Application was declined';
	private CLOSE_NOTIFICATION_MODAL: string = 'close_notification_modal_btn';
	private SUBMITTED_APPLICATIONS_TAB: string = 'submitted_applications_tab';
	private LOADING_APPLICATIONS: string = 'loading_applications';
	private APPLICATIONS_CONTAINER: string = 'applications_container';
	private SITE_LOADER: string = 'site-loader';

	readonly page: Page;
	readonly baseURL: string;

	constructor(page: Page, baseURL) {
		this.page = page;
		this.baseURL = baseURL;
	}

	async goto() {
		console.log('Goto Application overview Page');
		await this.page.goto(`${this.baseURL}/#/applications`, { waitUntil: 'networkidle' });
		console.log(this.page.url());
		expect(this.page.url()).toContain('/applications');
		await this.page.waitForSelector(Util.by_data_test_id_str(this.SITE_LOADER), { state: 'hidden' });
	}

	async goToSubmittedApplication() {
		await this.goto();
		await this.page.locator(Util.by_data_test_id_str(this.SUBMITTED_APPLICATIONS_TAB)).click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { state: 'hidden' });
		await this.page.waitForSelector(Util.by_data_test_id_str('submitted_applications_container'), {
			state: 'visible',
		});
	}

	async goToLifetimeRequests() {
		await this.goto();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { state: 'hidden' });
		await this.page.waitForTimeout(5000);
		await this.page.locator(Util.by_data_test_id_str(this.EXTENSION_TAB_BUTTON)).click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { state: 'hidden' });
		await this.page.waitForSelector(Util.by_data_test_id_str('lifetime_requests_applications_container'), {
			state: 'visible',
		});
	}

	async goToModificationRequests() {
		await this.goto();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { state: 'hidden' });
		await this.page.waitForTimeout(5000);
		await this.page.locator(Util.by_data_test_id_str(this.MODIFICATION_TAB_BUTTON)).click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { state: 'hidden' });
		await this.page.waitForSelector(Util.by_data_test_id_str('modification_requests_applications_container'), {
			state: 'visible',
		});
	}

	async declineApplications(projectName: string): Promise<void> {
		await this.goToSubmittedApplication();
		console.log(`Decling open ${projectName} applications.`);
		const application_count: number = await this.page
			.locator(Util.by_data_test_id_str(`${this.DECLINE_OPEN_APPLICATION_PRE}${projectName}`))
			.count();
		console.log(`Declining ${application_count} applications with ${projectName} as name.`);
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < application_count; i++) {
			// eslint-disable-next-line no-await-in-loop
			await this.page.locator(`data-test-id=${this.DECLINE_OPEN_APPLICATION_PRE}${projectName}`).first().click();
			// eslint-disable-next-line no-await-in-loop
			await this.page.waitForSelector(`data-test-id=${this.NOTIFICATION_MESSAGE} >> text=${this.SUCCESSFULL_DECLINED}`);
			// eslint-disable-next-line no-await-in-loop
			await this.page.locator(Util.by_data_test_id_str(this.CLOSE_NOTIFICATION_MODAL)).click();
		}
	}

	async approveOpenStackModificationRequest(application_name: string): Promise<any> {
		await this.goToModificationRequests();
		await this.page.locator(Util.by_data_test_id_str(this.MODIFICATION_APPROVAL_BTN_PREFIX + application_name)).click();
		await this.page.waitForSelector(
			`data-test-id=${this.NOTIFICATION_MESSAGE} >> text=${this.MODIFICATION_REQUEST_RESULT_TEXT}`,
		);
	}

	async approveSimpleVMModificationRequest(application_name: string): Promise<any> {
		await this.goToModificationRequests();
		await this.page.waitForTimeout(10000);
		await this.page.locator(Util.by_data_test_id_str(this.MODIFICATION_APPROVAL_BTN_PREFIX + application_name)).click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.APPROVAL_CLIENT_LIMIT_PREFIX + application_name), {
			state: 'visible',
		});
		await this.page.locator(Util.by_data_test_id_str(this.APPROVAL_CLIENT_LIMIT_PREFIX + application_name)).click();
		await this.page.waitForSelector(
			`data-test-id=${this.NOTIFICATION_MESSAGE} >> text=${this.MODIFICATION_REQUEST_RESULT_TEXT}`,
		);
	}

	async approveSimpleVMExtensionRequest(application_name: string): Promise<any> {
		await this.goToLifetimeRequests();
		await this.page.locator(Util.by_data_test_id_str(this.EXTENSION_APPROVAL_BTN_PREFIX + application_name)).click();
		await this.page.waitForSelector(
			`data-test-id=${this.NOTIFICATION_MESSAGE} >> text=${this.EXTENSION_RESULT_SIMPLEVM_TEXT}`,
		);
	}

	async approveOpenStackExtensionRequest(application_name: string): Promise<any> {
		await this.goToLifetimeRequests();
		await this.page.locator(Util.by_data_test_id_str(this.EXTENSION_APPROVAL_BTN_PREFIX + application_name)).click();
		await this.page.waitForSelector(
			`data-test-id=${this.NOTIFICATION_MESSAGE} >> text=${this.EXTENSION_RESULT_OPENSTACK_TEXT}`,
		);
	}

	async approveSimpleVm(application_name: string): Promise<any> {
		console.log('Approve Simple VM');
		await this.goToSubmittedApplication();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.COMPUTE_CENTER_SELECTION_PREFIX + application_name), {
			state: 'visible',
		});
		await this.page.selectOption(Util.by_data_test_id_str(this.COMPUTE_CENTER_SELECTION_PREFIX + application_name), {
			label: this.DEFAULT_DENBI_COMPUTE_CENTER,
		});
		await this.page.locator(Util.by_data_test_id_str(this.APPROVAL_PREFIX + application_name)).click();
		await this.page.locator(Util.by_data_test_id_str(this.APPROVAL_CLIENT_LIMIT_PREFIX + application_name)).click();
		await this.page.waitForSelector(`data-test-id=${this.NOTIFICATION_MESSAGE} >> text=${this.SIMPLE_VM_CREATED}`);
	}

	async approveOpenStackApplication(application_name: string): Promise<any> {
		console.log('Approve Openstack');
		await this.goToSubmittedApplication();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.COMPUTE_CENTER_SELECTION_PREFIX + application_name), {
			state: 'visible',
		});
		await this.page.selectOption(Util.by_data_test_id_str(this.COMPUTE_CENTER_SELECTION_PREFIX + application_name), {
			label: this.DEFAULT_DENBI_COMPUTE_CENTER,
		});
		await this.page.waitForTimeout(10000);
		await this.page.locator(Util.by_data_test_id_str(this.APPROVAL_PREFIX + application_name)).isEnabled();
		await this.page.locator(Util.by_data_test_id_str(this.APPROVAL_PREFIX + application_name)).click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.NOTIFICATION_MESSAGE), { state: 'visible' });
		await this.page.waitForSelector(`data-test-id=${this.NOTIFICATION_MODAL_TITLE} >> text=Success`);
		const approval_response: string = await this.page.innerText(Util.by_data_test_id_str(this.NOTIFICATION_MESSAGE));
		expect(approval_response).toContain(this.PROJECT_FACILITY_ASSIGNED);
	}
}
