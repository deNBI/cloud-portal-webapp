import { expect, Page } from '@playwright/test';
import { Util } from '../util';

/**
 * Facilityoverivew page.
 */
export class FacilityApplicationOverviewPage {
	private readonly FACILITY_OVERVIEW_URL: string = 'facility-manager/facilityApplications';
	private readonly APPLICATION_APPROVAL_BTN_PREFIX: string = 'approval_';
	private readonly SUCCESSFULLY_APPROVED_APPL: string = 'Successfully approved the application.';
	private readonly NOTIFICATION_MESSAGE: string = 'notification_message';
	private readonly EXTENSION_APPROVAL_BTN_PREFIX: string = 'extension_approval_';
	private readonly MODIFICATION_APPROVAL_BTN_PREFIX: string = 'approveModificationButton_';
	private readonly EXTENSION_SUCCESSFULLY: string = 'Successfully approved extension!';
	private readonly MODIFICATION_EXTENSION_SUCCESS_TEXT: string = 'Successfully approved modification!';
	private readonly TAB_STATE_MODIFICATION_BUTTON: string = 'tab_state_button_modification_requests';
	private readonly TAB_STATE_TERMINATION_BUTTON: string = 'tab_state_button_termination_requests';
	private readonly APPROVE_TERMINATION_PT_APPLICATION_BTN: string = 'approve_terminate_project_btn';
	private readonly TERMINATE_PROJECT_BTN: string = 'terminate_project_btn';
	private readonly WAS_TERMINATED: string = 'The project was terminated.';
	private readonly CLOSE_NOTIFICATION_MODAL: string = 'close_notification_modal_btn';
	private readonly LOADING_APPLICATIONS: string = 'loading_applications';
	private readonly NOTIFICATION_MODAL_TITLE: string = 'notification_modal_title';
	private readonly SUBMITTED_APPLICATIONS_TAB = 'submitted_applications_tab';
	private readonly TERMINATION_TABLE: string = 'termination_table';
	private readonly TERMINATION_COUNTER: string = 'termination_counter';
	private readonly CLOSE_NOTIFICATION_BTN: string = 'close_notification_modal_btn';

	private readonly TERMINATE_REQUESTS_APPLICATIONS_TAB = 'terminate_requests_applications_tab';

	private readonly TERMINATION_REQUESTS_APPLICATIONS_CONTAINER = 'termination_requests_applications_container';
	private readonly EXTENSION_REQUESTS_APPLICATIONS_TAB = 'extension_requests_applications_tab';

	private readonly LIFETIME_REQUESTS_APPLICATIONS_CONTAINER = 'lifetime_requests_applications_container';
	private SUBMITTED_APPLICATIONS_CONTAINER = 'submitted_applications_container';
	private readonly MODIFICATION_REQUESTS_APPLICATIONS_TAB = 'modification_requests_applications_tab';

	private readonly MODIFICATION_REQUESTS_APPLICATIONS_CONTAINER = 'modification_requests_applications_container';

	readonly page: Page;
	readonly baseURL: string;

	constructor(page: Page, baseURL) {
		this.page = page;
		this.baseURL = baseURL;
	}

	async goto() {
		console.log('Goto Facility Application overview');
		await this.page.goto(`${this.baseURL}/#/facility-manager/facilityApplications`, { waitUntil: 'networkidle' });
		console.log(this.page.url());

		expect(this.page.url()).toContain('/#/facility-manager/facilityApplications');
	}

	async goToSubmittedApplication() {
		await this.goto();
		await this.page.locator(Util.by_data_test_id_str(this.SUBMITTED_APPLICATIONS_TAB)).click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { state: 'hidden' });
		await this.page.waitForSelector(Util.by_data_test_id_str(this.SUBMITTED_APPLICATIONS_CONTAINER), {
			state: 'visible',
		});
	}

	async goToLifetimeRequests() {
		await this.goto();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { state: 'hidden' });
		await this.page.waitForTimeout(5000);
		await this.page.locator(Util.by_data_test_id_str(this.EXTENSION_REQUESTS_APPLICATIONS_TAB)).click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { state: 'hidden' });
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LIFETIME_REQUESTS_APPLICATIONS_CONTAINER), {
			state: 'visible',
		});
	}

	async goToModificationRequests() {
		await this.goto();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { state: 'hidden' });
		await this.page.waitForTimeout(5000);
		await this.page.locator(Util.by_data_test_id_str(this.MODIFICATION_REQUESTS_APPLICATIONS_TAB)).click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { state: 'hidden' });
		await this.page.waitForSelector(Util.by_data_test_id_str(this.MODIFICATION_REQUESTS_APPLICATIONS_CONTAINER), {
			state: 'visible',
		});
	}

	async goToTerminationRequests() {
		await this.goto();
		console.log('Click Termination Request Tab');
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { state: 'hidden' });
		await this.page.waitForTimeout(5000);
		await this.page.locator(Util.by_data_test_id_str(this.TERMINATE_REQUESTS_APPLICATIONS_TAB)).click();
		console.log('Wait for loader gone');
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { state: 'hidden' });
		console.log('Wait for loaded applications');
		await this.page.waitForSelector(Util.by_data_test_id_str(this.TERMINATION_REQUESTS_APPLICATIONS_CONTAINER), {
			state: 'visible',
		});
	}

	async approveApplication(application_name: string): Promise<any> {
		await this.goToSubmittedApplication();
		console.log(`Approve Application${application_name}`);
		await this.page.locator(Util.by_data_test_id_str(this.APPLICATION_APPROVAL_BTN_PREFIX + application_name)).click();
		await this.page.waitForSelector(`data-test-id=${this.NOTIFICATION_MODAL_TITLE} >> text=Success`);
		const approval_response: string = await this.page.innerText(Util.by_data_test_id_str(this.NOTIFICATION_MESSAGE));
		expect(approval_response).toContain(this.SUCCESSFULLY_APPROVED_APPL);
		await this.page.locator(Util.by_data_test_id_str(this.CLOSE_NOTIFICATION_MODAL)).click();
	}

	async approveApplicationExtension(application_name: string): Promise<any> {
		await this.goToLifetimeRequests();
		console.log(`Approve Application${application_name} Extension`);
		await this.page.locator(Util.by_data_test_id_str(this.EXTENSION_APPROVAL_BTN_PREFIX + application_name)).click();
		await this.page.waitForSelector(`data-test-id=${this.NOTIFICATION_MODAL_TITLE} >> text=Success`);

		const approval_response: string = await this.page.innerText(Util.by_data_test_id_str(this.NOTIFICATION_MESSAGE));
		expect(approval_response).toContain(this.EXTENSION_SUCCESSFULLY);
		await this.page.locator(Util.by_data_test_id_str(this.CLOSE_NOTIFICATION_MODAL)).click();
	}

	async terminateApplications(project_name: string): Promise<any> {
		await this.goToTerminationRequests();
		console.log(`Terminate all openstack projects with name ${project_name}`);
		const project_count: number = await this.page.locator(Util.by_data_test_id_str(this.TERMINATE_PROJECT_BTN)).count();
		console.log(`Terminating ${project_count} openstack projects with name ${project_name}`);
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < project_count; i++) {
			// eslint-disable-next-line no-await-in-loop
			await this.page.locator(Util.by_data_test_id_str(this.TERMINATE_PROJECT_BTN)).first().click();
			// eslint-disable-next-line no-await-in-loop
			await this.page.locator(Util.by_data_test_id_str(this.APPROVE_TERMINATION_PT_APPLICATION_BTN)).first().click();
			// eslint-disable-next-line no-await-in-loop
			await this.page.waitForSelector(`data-test-id=${this.NOTIFICATION_MESSAGE} >> text=${this.WAS_TERMINATED}`);
			// eslint-disable-next-line no-await-in-loop
			await this.page.locator(Util.by_data_test_id_str(this.CLOSE_NOTIFICATION_BTN)).click();
		}
	}

	async approveApplicationModification(application_name: string): Promise<any> {
		await this.goToModificationRequests();
		await this.page.locator(Util.by_data_test_id_str(this.MODIFICATION_APPROVAL_BTN_PREFIX + application_name)).click();
		await this.page.waitForSelector(`data-test-id=${this.NOTIFICATION_MODAL_TITLE} >> text=Success`);

		const approval_response: string = await this.page.innerText(Util.by_data_test_id_str(this.NOTIFICATION_MESSAGE));
		expect(approval_response).toContain(this.MODIFICATION_EXTENSION_SUCCESS_TEXT);
		await this.page.locator(Util.by_data_test_id_str(this.CLOSE_NOTIFICATION_MODAL)).click();
	}
}
