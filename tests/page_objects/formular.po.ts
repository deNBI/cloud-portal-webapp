import { expect, Page } from '@playwright/test';
import { Util } from '../util';

/**
 * Page object for the Application requests.
 */
export class FormularPage {
	private SIDEBAR_NEW_PROJECT: string = 'sidebar_new_project';
	private NEW_SVM_BTN: string = 'newSimpleVMBtn';
	private NEW_OPENSTACK_BTN: string = 'newOpenstackBtn';
	private SUBMIT_BTN: string = 'submit_application_btn';
	private VERIFICATION_BTN: string = 'verification_application_btn';
	private BACKUP_ACKNOWLEDGE_BTN: string = 'backup_approve_btn';
	private ACKNOWLEDGE_BTN: string = 'acknowledge_approve_btn';
	private APPLICATION_SUBMITTED: string = 'The application was submitted';
	private NOTIFICATION_MESSAGE: string = 'notification_message';
	public NOTIFICATION_BTN_REDIRECT: string = 'notification_btn_redirect';
	private NUMBER_FLAVORS: string = '5';
	private PI_RESPONSIBILITY: string = 'project_application_responsibility';
	private PI_APPROVAL_BUTTON: string = 'approveApplicationButtonPI';

	private UNKNOWN_PI_RESPONSIBILITY_APPROVAL_VALIDATION: string = 'project_application_responsibility_checkbox';
	private UNKNOWN_PI_RESPONSIBILITY_APPROVAL_NO_VALIDATION: string =		'project_application_responsibility_checkbox_no_validation';

	private UNKNOWN_PI_AFFILIATION_CHECKBOX: string = 'unknown-pi-affiliations-checkbox';
	readonly page: Page;
	readonly baseURL: string;

	constructor(page: Page, baseURL) {
		this.page = page;
		this.baseURL = baseURL;
	}

	async goto() {
		console.log('Goto Type-Overview Page');
		await this.page.goto(`${this.baseURL}/#/applications/type-overview`);
		console.log(this.page.url());

		expect(this.page.url()).toContain('/#/applications/type-overview');
	}

	async goToNewSimpleVMProject() {
		await this.goto();
		await this.page.locator(Util.by_data_test_id_str(this.NEW_SVM_BTN)).click();
		await this.page.waitForURL('**/applications/newSimpleVmApplication');
	}

	async goToNewOpenStackApplication() {
		await this.goto();
		await this.page.locator(Util.by_data_test_id_str(this.NEW_OPENSTACK_BTN)).click();
		await this.page.waitForURL('**/applications/newCloudApplication');
	}

	async submitApplication(): Promise<any> {
		console.log('Submit Application');

		await this.page.locator(Util.by_data_test_id_str(this.SUBMIT_BTN)).click();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFICATION_BTN)).click();
		await this.page.locator(Util.by_data_test_id_str(this.BACKUP_ACKNOWLEDGE_BTN)).click();
		await this.page.locator(Util.by_data_test_id_str(this.ACKNOWLEDGE_BTN)).click();
		await this.page.waitForSelector(`data-test-id=${this.NOTIFICATION_MESSAGE} >> text=${this.APPLICATION_SUBMITTED}`);
		console.log('Submitted Application');
	}

	async fillApplicationFormular(name: string, is_pi?: boolean, openstack?: boolean): Promise<any> {
		// fill  Formular
		console.log('Fill form');
		console.log(`Is PI: ${is_pi}`);
		await this.page.fill(Util.by_data_test_id_str('project_application_name_input'), name);
		await this.page.fill(Util.by_data_test_id_str('project_application_shortname_input'), name);
		await this.page.fill(
			Util.by_data_test_id_str('project_application_description_input'),
			'ProtractorTest Description',
		);
		await this.page.fill(Util.by_data_test_id_str('project_application_lifetime_input'), '4');
		if (!openstack) {
			await this.page.locator(Util.by_data_test_id_str('project_application_workshop_input')).click();
		}
		await this.page.fill(Util.by_data_test_id_str('project_application_institute_input'), 'Proctractor Institute');
		await this.page.fill(Util.by_data_test_id_str('project_application_workgroup_input'), 'Proctractor Workgroup');
		await this.page.locator(Util.by_data_test_id_str('project_application_bmbf_switch')).click();
		await this.page.fill(Util.by_data_test_id_str('project_application_bmbf_project-input'), 'BMBF Project');
		await this.page.locator(Util.by_data_test_id_str('project_application_elixir_switch')).click();
		await this.page.fill(Util.by_data_test_id_str('project_application_elixir_project_input'), 'Elixir Project');
		await this.page.fill(Util.by_data_test_id_str('std_0'), this.NUMBER_FLAVORS);
		await this.page.locator(Util.by_data_test_id_str('edam_input')).click();
		await this.page.fill('[aria-autocomplete=list]', 'Bioinformatics');
		await this.page.locator('[role=option]').click();
		await this.page.locator(Util.by_data_test_id_str('project_application_horizon_switch')).click();
		await this.page.fill(Util.by_data_test_id_str('project_application_horizon2020_input'), 'Horizon2020Project');
		await this.page.fill(Util.by_data_test_id_str('project_application_volume_counter'), '2');

		await this.page.fill(Util.by_data_test_id_str('project_application_volume_limit_input'), '2');

		await this.page.locator(Util.by_data_test_id_str('project_application_report_allowed_switch')).click();
		await this.page.locator(Util.by_data_test_id_str('project_application_person_related_data_switch')).click();
		await this.page.locator(Util.by_data_test_id_str('project_application_no_personal_data_switch')).click();
		await this.page.fill(Util.by_data_test_id_str('information_public_title_input'), 'A Public Title');
		await this.page.locator(Util.by_data_test_id_str('public_description_enabled_switch')).click();
		await this.page.fill(Util.by_data_test_id_str('information_description_input'), 'A Public Description');
		await this.page.locator(Util.by_data_test_id_str('information_resources_checkbox')).click();
		await this.page.locator(Util.by_data_test_id_str('information_lifetime_checkbox')).click();
		await this.page.locator(Util.by_data_test_id_str('information_project_type_checkbox')).click();
		await this.page.locator(Util.by_data_test_id_str('information_pi_name_checkbox')).click();
		await this.page.locator(Util.by_data_test_id_str('information_institution_checkbox')).click();
		await this.page.locator(Util.by_data_test_id_str('information_workgroup_checkbox')).click();
		await this.page.locator(Util.by_data_test_id_str('information_project_affiliation_checkbox')).click();
		await this.page.locator(Util.by_data_test_id_str('platform_denbi_checkbox')).click();
		await this.page.locator(Util.by_data_test_id_str('platform_twitter_checkbox')).click();

		if (is_pi) {
			await this.page.locator(Util.by_data_test_id_str('project_application_pi_approved_checkbox')).click();
			await this.page.waitForTimeout(200);
			await this.page.locator(Util.by_data_test_id_str(this.UNKNOWN_PI_RESPONSIBILITY_APPROVAL_NO_VALIDATION)).click();
			if (await this.page.locator(Util.by_data_test_id_str(this.UNKNOWN_PI_AFFILIATION_CHECKBOX)).isVisible()) {
				await this.page.locator(Util.by_data_test_id_str(this.UNKNOWN_PI_AFFILIATION_CHECKBOX)).click();
			}
		} else {
			await this.page.fill(Util.by_data_test_id_str('project_application_pi_email_input'), Util.PI_EMAIL);
		}
	}
}
