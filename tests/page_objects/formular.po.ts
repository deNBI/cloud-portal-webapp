import { expect, Page } from '@playwright/test';
import { Util } from '../util';

/**
 * Page object for the Application requests.
 */
export class FormularPage {
	private SIDEBAR_NEW_PROJECT: string = 'sidebar_new_project';
	private NEW_SVM_BTN: string = 'newSimpleVMBtn';
	private NEW_OPENSTACK_BTN: string = 'newOpenStackBtn';
	private SUBMIT_BTN: string = 'submit_btn';
	private VERIFICATION_BTN: string = 'verification_btn';
	private ACKNOWLEDGE_BTN: string = 'acknowledge_approve_btn';
	private APPLICATION_SUBMITTED: string = 'The application was submitted';
	private NOTIFICATION_MESSAGE: string = 'notification_message';
	public NOTIFICATION_BTN_REDIRECT: string = 'notification_btn_redirect';
	private NUMBER_FLAVORS: string = '5';
	private PI_RESPONSIBILITY: string = 'project_application_responsibility';
	private PI_APPROVAL_BUTTON: string = 'approveApplicationButtonPI';
	readonly page: Page;
	readonly baseURL: string;

	constructor(page: Page, baseURL: string) {
		this.page = page;
		this.baseURL = baseURL;

	}

	async goto() {
		console.log('Goto Type-Overview Page');
		await this.page.goto('/#/applications/type-overview');

		expect(this.page.url()).toContain('/#/applications/type-overview');

	}

	async goToNewSimpleVMProject() {
		await this.goto();
		await this.page.locator(`[data-test-id=${this.NEW_SVM_BTN}]`).click();
		await this.page.waitForURL('**/applications/newSimpleVmApplication');

	}

	async goToNewOpenStackApplication() {
		await this.goto();
		await this.page.waitForSelector(`[data-test-id=${this.NEW_OPENSTACK_BTN}]`);
		await this.page.locator(`[data-test-id=${this.NEW_OPENSTACK_BTN}]`).click();

		await this.page.waitForURL('**/applications/newCloudApplication');
	}

	async submitApplication(): Promise<any> {
		console.log('Submit Application');

		await this.page.locator(`[data-test-id=${this.SUBMIT_BTN}]`).click();
		await this.page.locator(`[data-test-id=${this.VERIFICATION_BTN}]`).click();
		await this.page.locator(`[data-test-id=${this.ACKNOWLEDGE_BTN}]`).click();
		console.log('Submitted Application');
	}

	async fillApplicationFormular(name: string, is_pi?: boolean, openstack?: boolean): Promise<any> {

		// fill  Formular
		console.log('Fill form');
		await this.page.fill('[data-test-id=project_application_name_input]', name);
		await this.page.fill('[data-test-id=project_application_shortname_input]', name);
		await this.page.fill('[data-test-id=project_application_description_input]', 'ProtractorTest Description');
		await this.page.fill('[data-test-id=project_application_lifetime_input]', '4');
		if (!openstack) {
			await this.page.locator('[data-test-id=project_application_workshop_input]').click();
		}
		await this.page.fill('[data-test-id=project_application_institute_input]', 'Proctractor Institute');
		await this.page.fill('[data-test-id=project_application_workgroup_input]', 'Proctractor Workgroup');
		await this.page.locator('[data-test-id=project_application_bmbf_switch]').click();
		await this.page.fill('[data-test-id=project_application_bmbf_project-input]', 'BMBF Project');
		await this.page.locator('[data-test-id=project_application_elixir_switch]').click();
		await this.page.fill('[data-test-id=project_application_elixir_project_input]', 'Elixir Project');
		await this.page.fill('[data-test-id=de.NBI default]', this.NUMBER_FLAVORS);
		await this.page.type('[data-test-id=edam_input]', 'Bioinformatics');
		await this.page.locator('ng-option-label >> text=Bioinformatics').click();
		await this.page.locator('[data-test-id=project_application_horizon_switch]').click();
		await this.page.fill('[data-test-id=project_application_horizon2020_input]', 'Horizon2020Project');
		await this.page.fill('[data-test-id=project_application_volume_limit_input]', '2');
		await this.page.locator('[data-test-id=project_application_report_allowed_switch]').click();
		await this.page.locator('[data-test-id=project_application_sensitive_data_switch]').click();
		await this.page.fill('[data-test-id=information_public_title_input]', 'A Public Title');
		await this.page.locator('[data-test-id=public_description_enabled_switch]').click();
		await this.page.fill('[data-test-id=information_description_input]', 'A Public Description');
		await this.page.locator('[data-test-id=information_resources_checkbox]').click();
		await this.page.locator('[data-test-id=information_lifetime_checkbox]').click();
		await this.page.locator('[data-test-id=information_project_type_checkbox]').click();
		await this.page.locator('[data-test-id=information_pi_name_checkbox]').click();
		await this.page.locator('[data-test-id=information_institution_checkbox]').click();
		await this.page.locator('[data-test-id=information_workgroup_checkbox]').click();
		await this.page.locator('[data-test-id=information_project_affiliation_checkbox]').click();
		await this.page.locator('[data-test-id=platform_denbi_checkbox]').click();
		await this.page.locator('[data-test-id=platform_twitter_checkbox]').click();

		if (is_pi) {
			await this.page.locator('[data-test-id=project_application_pi_approved_checkbox]').click();
			await this.page.locator('[data-test-id=project_application_responsibility_checkbox]').click();
		} else {
			await this.page.fill('[data-test-id=project_application_pi_email_input]', Util.PI_EMAIL);
		}
	}
}
