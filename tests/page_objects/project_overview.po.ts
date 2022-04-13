import { expect, Page } from '@playwright/test';
import { Util } from '../util';

/**
 * Project overview page object.
 */
export class ProjectOverViewPage {
	// GENERAL
	private PROJECT_LIST: string = 'project_list';
	private PROJECT_LIST_TOGGLER: string = 'project_list_folded_toggler';
	private PROJECT_OVERVIEW_BUTTON_PREFIX: string = 'project_overview_';
	private SITE_LOADER: string = 'site-loader';
	private PROFILE_LOADER: string = 'div .loader';

	// MODIFICATIONS
	private OPEN_EXTENSION_REQUEST_BUTTON: string = 'open_extension_request_button';
	private OPEN_MODIFICATION_REQUEST_BUTTON: string = 'open_modification_request_button';
	private OPEN_TERMINATION_REQUEST_BUTTON: string = 'open_termination_request_button';
	private DECLINE_NEW_PUBLICATION_BUTTON: string = 'decline_publication_button';
	private PROJECT_EXTENSION_MONTHS_INPUT: string = 'project_extension_months_input';
	private SUBMIT_EXTENSION_REQUEST_BUTTON: string = 'submit_extension_request_button';
	private SUBMIT_MODIFICATION_REQUEST_BUTTON: string = 'submit_modification_request_button';
	private CONFIRM_EXTENSION_REQUEST_BUTTON: string = 'confirm_extension_request_button';
	private CONFIRM_MODIFICATION_REQUEST_BUTTON: string = 'confirm_modification_request_button';
	private CONFIRM_TERMINATION_REQUEST_INPUT: string = 'confirm_termination_request_input';
	private CONFIRM_TERMINATION_REQUEST_BUTTON: string = 'confirm_termination_request_button';
	private EXTENSION_REQUESTED_SUCCESSFULLY: string = 'Lifetime extension request successfully submitted!';
	private MODIFICATION_REQUESTED_SUCCESSFULLY: string = 'Modification request successfully submitted!';
	private TERMINATION_REQUESTED_SUCCESSFULLY: string = 'Termination was requested!';
	private EXTENSION_REQUEST_RESULT_DIV: string = 'extension_request_result_div';
	private MODIFICATION_REQUEST_RESULT_DIV: string = 'modification_request_result_div';
	private TERMINATION_REQUEST_RESULT_DIV: string = 'termination_request_result_div';
	private NUMBER_MODIFICATION_FLAVORS: string = '7';
	private NUMBER_MODIFICATION_VOLUMES: string = '5';
	private MODIFICATION_REQUEST_VOLUME_COUNTER_INPUT: string = 'modification_request_volume_counter_input';
	private MODIFICATION_REQUEST_VOLUME_LIMIT_INPUT: string = 'modification_request_volume_limit_input';
	private MODIFICATION_REQUEST_OBJECT_STORAGE_INPUT: string = 'modification_request_object_storage_input';

	// MEMBER
	private DEFAULT_MEMBER_EMAIL: string = 'testuserdenbi@gmail.com';
	private ADD_MEMBER_BTN_MODAL: string = 'add_member_btn_modal';
	private SEARCH_MEMBER: string = 'add_member_input';
	private ADD_MEMBER_BTN: string = 'add_member_btn';
	private SEARCH_MEMBER_BTN: string = 'search_member_btn';
	private SUCCESS: string = 'Success';
	private NOTIFICATION_TITLE: string = 'notification_title';
	private NOTIFICATION_CLOSE: string = 'close_notification';
	private CLOSE_ADD_MEMBER_MODAL_BTN: string = 'close_add_user_modal_btn';

	readonly page: Page;
	readonly baseURL: string;

	constructor(page: Page, baseURL) {
		this.page = page;
		this.baseURL = baseURL;
	}

	async gotoProfilePage() {
		console.log('Goto Profile Page');
		await this.page.goto(`${this.baseURL}/#/userinfo`, { waitUntil: 'networkidle' });
		expect(this.page.url()).toContain('/userinfo');
		await this.page.locator('text=Profile Information').waitFor();
	}

	async goToProjectOverview(project_name: string) {
		await this.gotoProfilePage();
		console.log(`Goto Project overview Page for Project ${project_name}`);
		const project_list = this.page.locator(Util.by_data_test_id_str(this.PROJECT_LIST));
		if (!project_list) {
			await this.page.locator(Util.by_data_test_id_str(this.PROJECT_LIST_TOGGLER)).click();
		}
		await Promise.all([
			this.page.waitForNavigation(),
			this.page.locator(Util.by_data_test_id_str(this.PROJECT_OVERVIEW_BUTTON_PREFIX + project_name)).click(),
		]);
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

	async requestTermination() {
		await this.page.locator(Util.by_data_test_id_str(this.OPEN_TERMINATION_REQUEST_BUTTON)).click();
		await this.page.locator(Util.by_data_test_id_str(this.CONFIRM_TERMINATION_REQUEST_INPUT)).click();
		await this.page.locator(Util.by_data_test_id_str(this.CONFIRM_TERMINATION_REQUEST_BUTTON)).click();
		await this.page.waitForSelector(
			`data-test-id=${this.TERMINATION_REQUEST_RESULT_DIV} >> text=${this.TERMINATION_REQUESTED_SUCCESSFULLY}`,
		);
	}

	async addMember(member: string = this.DEFAULT_MEMBER_EMAIL) {
		await this.page.locator(Util.by_data_test_id_str(this.ADD_MEMBER_BTN_MODAL)).click();
		await this.page.fill(Util.by_data_test_id_str(this.SEARCH_MEMBER), member);
		await this.page.locator(Util.by_data_test_id_str(this.SEARCH_MEMBER_BTN)).click();
		await this.page.locator(Util.by_data_test_id_str(this.ADD_MEMBER_BTN)).click();
		await this.page.waitForSelector(`data-test-id=${this.NOTIFICATION_TITLE} >> text=${this.SUCCESS}`);
		await this.page.locator(Util.by_data_test_id_str(this.NOTIFICATION_CLOSE)).click();
		await this.page.locator(Util.by_data_test_id_str(this.CLOSE_ADD_MEMBER_MODAL_BTN)).click();
	}
}
