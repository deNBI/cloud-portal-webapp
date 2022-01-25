import { by, element, ElementFinder } from 'protractor';
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
	private EXTENSION_APPROVAL_BTN_PREFIX: string = 'extension_approval_';
	private COMPUTE_CENTER_SELECTION_PREFIX: string = 'id_compute_center_option_';
	private DEFAULT_DENBI_COMPUTE_CENTER: string = 'de.NBI Cloud Portal - Development';
	private CLOUD_PROJECT_CREATED: string = 'The new project was created';
	private SIMPLE_VM_CREATED: string = 'The project was created!';
	private NOTIFICATION_MESSAGE: string = 'notification_modal_message';
	private NOTIFICATION_MODAL_TITLE: string = 'notification_modal_title';
	private APPROVAL_PREFIX: string = 'approve_';
	private APPROVAL_CLIENT_LIMIT_PREFIX: string = 'approve_client_limit_';
	private MODIFICATION_TAB_BUTTON: string = 'tab_state_button_modification_request';
	private MODIFICATION_APPROVAL_BTN_PREFIX: string = 'modification_approval_';
	private MODIFICATION_REQUEST_RESULT_TEXT: string = 'The resource modification request was approved!';
	private EXTENSION_TAB_BUTTON: string = 'tab_state_button_extension_request';
	private EXTENSION_RESULT_MESSAGE_TEXT: string = 'The project has been extended!';
	private DECLINE_PT_OPEN_APPLICATION_PRE: string = 'btn_decline_PTOpenStack';
	private DECLINE_PT_SIMPLE_APPLICATION_PRE: string = 'btn_decline_PTSimpleVM';
	private SUCCESSFULL_DECLINED: string = 'The Application was declined';
	private CLOSE_NOTIFICATION_MODAL: string = 'close_notification_modal_btn';
	private SUBMITTED_APPLICATIONS_TAB: string = 'tab_state_button_submitted_applications';
	private LOADING_APPLICATIONS: string = 'loading_applications';
	private SITE_LOADER: string = 'site-loader';
	private BIELEFELD_DEV_FACILITY_ID = '3385';

	readonly page: Page;
	readonly baseURL: string;

	constructor(page: Page, baseURL: string) {
		this.page = page;
		this.baseURL = baseURL;
	}

	async goto() {
		console.log('Goto Application overview Page');
		await this.page.goto('/#/applications');
		expect(this.page.url()).toContain('/applications');
		await this.page.waitForSelector(Util.by_data_test_id_str(this.SITE_LOADER), { visible: false });

	}

	async goToSubmittedApplication() {
		await this.goto();
		await this.page.locator(Util.by_data_test_id_str('submitted_applications_tab')).click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { visible: false });
	}

	async goToLifetimeRequests() {
		await this.goto();
		await this.page.locator(Util.by_data_test_id_str('extension_requests_applications_tab')).click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { visible: false });
	}

	async goToModificationRequests() {
		await this.goto();
		await this.page.locator(Util.by_data_test_id_str('modification_requests_applications_tab')).click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.LOADING_APPLICATIONS), { visible: false });
	}

	/* async declinePTApplications(): Promise<any> {
		console.log('Decline all PT applications');
		await Util.waitForPresenceOfElementById(this.SUBMITTED_APPLICATIONS_TAB);
		console.log('Decline open PT OpenStack applications');

		let openstack_ele: ElementFinder = element(by.id(this.DECLINE_PT_OPEN_APPLICATION_PRE));

		while (await openstack_ele.isPresent()) {
			await Util.clickElementByElement(openstack_ele);
			await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.SUCCESSFULL_DECLINED);
			await Util.clickElementById(this.CLOSE_NOTIFICATION_MODAL);
			openstack_ele = element(by.id(this.DECLINE_PT_OPEN_APPLICATION_PRE));

		}
		console.log('Decline open PT SimpleVM applications');

		let simple_ele: ElementFinder = element(by.id(this.DECLINE_PT_SIMPLE_APPLICATION_PRE));
		while (await simple_ele.isPresent()) {
			await Util.clickElementByElement(simple_ele);
			await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.SUCCESSFULL_DECLINED);
			await Util.clickElementById(this.CLOSE_NOTIFICATION_MODAL);
			simple_ele = element(by.id(this.DECLINE_PT_SIMPLE_APPLICATION_PRE));

		}

	} */

	async approveOpenStackModificationRequest(application_name: string): Promise<any> {
		await this.goToModificationRequests();
		await this.page.locator(Util.by_data_test_id_str(this.MODIFICATION_APPROVAL_BTN_PREFIX + application_name)).click();
		await this.page.waitForSelector(`data-test-id=${this.NOTIFICATION_MESSAGE} >> text=${this.MODIFICATION_REQUEST_RESULT_TEXT}`);
	}

	async approveSimpleVMModificationRequest(application_name: string): Promise<any> {
		await this.goToModificationRequests();
		await this.page.locator(Util.by_data_test_id_str(this.MODIFICATION_APPROVAL_BTN_PREFIX + application_name)).click();
		await this.page.locator(Util.by_data_test_id_str(this.APPROVAL_CLIENT_LIMIT_PREFIX + application_name)).click();
		await this.page.waitForSelector(`data-test-id=${this.NOTIFICATION_MESSAGE} >> text=${this.MODIFICATION_REQUEST_RESULT_TEXT}`);
	}

	async approveExtensionRequest(application_name: string): Promise<any> {
		await this.goToLifetimeRequests();
		await this.page.locator(Util.by_data_test_id_str(this.EXTENSION_APPROVAL_BTN_PREFIX + application_name)).click();
		await this.page.waitForSelector(`data-test-id=${this.NOTIFICATION_MESSAGE} >> text=${this.EXTENSION_RESULT_MESSAGE_TEXT}`);

	}

	/* async isApplicationRequestPresent(application_name: string): Promise<boolean> {
		await this.goto();

		await Util.waitForPresenceOfElementById(this.OWN_APPLICATION_ID);
		const elm: any = element(by.id(application_name));

		return await elm.isPresent();
	} */

	async approveSimpleVm(application_name: string): Promise<any> {
		console.log('Approve Simple VM');
		await this.goToSubmittedApplication();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.COMPUTE_CENTER_SELECTION_PREFIX + application_name), { visible: true });
		await this.page.selectOption(Util.by_data_test_id_str(this.COMPUTE_CENTER_SELECTION_PREFIX + application_name), { label: this.DEFAULT_DENBI_COMPUTE_CENTER });
		await this.page.locator(Util.by_data_test_id_str(this.APPROVAL_PREFIX + application_name)).click();
		await this.page.locator(Util.by_data_test_id_str(this.APPROVAL_CLIENT_LIMIT_PREFIX + application_name)).click();
		await this.page.waitForSelector(`data-test-id=${this.NOTIFICATION_MESSAGE} >> text=${this.SIMPLE_VM_CREATED}`);

	}

	async approveCloudApplication(application_name: string): Promise<any> {
		await this.goToSubmittedApplication();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.COMPUTE_CENTER_SELECTION_PREFIX + application_name), { visible: true });
		await this.page.selectOption(Util.by_data_test_id_str(this.COMPUTE_CENTER_SELECTION_PREFIX + application_name), { 'data-test-id': this.BIELEFELD_DEV_FACILITY_ID });
		await this.page.locator(Util.by_data_test_id_str(this.APPROVAL_PREFIX + application_name)).click();
		await this.page.waitForSelector(Util.by_data_test_id_str(this.NOTIFICATION_MESSAGE), { visible: true });
		await this.page.waitForSelector(`data-test-id=${this.NOTIFICATION_MODAL_TITLE} >> text=Success`);
		const approval_response: string = await this.page.innerText(Util.by_data_test_id_str(this.NOTIFICATION_MESSAGE));

		expect(approval_response).toContain(this.SIMPLE_VM_CREATED);

	}
}
