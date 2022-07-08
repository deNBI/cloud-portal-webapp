// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-extraneous-dependencies
import { expect, Page, Response } from '@playwright/test';
import { Util } from '../util';

/**
 * Workshop Overview Page.
 */
export class WorkshopOverviewPage {
	// GENERAL
	private PROJECT_SELECT: string = 'projectSelect';

	// ADD WORKSHOP
	private NEW_WORKSHOP_BUTTON: string = 'new_workshop_button_id';
	private CREATE_WORKSHOP_BUTTON: string = 'create_workshop_button_id';
	private CREATION_STATUS_MODAL: string = 'creation_status_modal';
	private CREATION_STATUS_MESSAGE_FIELD: string = 'creation_status_message';
	private SUCCESS_ALERT: string = 'creation_success';
	private ERROR_ALERT: string = 'creation_failure';
	private CLOSE_CEATION_STATUS_MODAL: string = 'close_creation_status_modal';
	private LONGNAME_FIELD: string = 'workshop_longname';
	private SHORTNAME_FIELD: string = 'workshop_shortname';

	// CLEANUP WORKSHOP
	private CLEANUP_WORKSHOP_BUTTON: string = 'cleanup_workshop_button_id';
	private VERIFY_CLEANUP_MODAL: string = 'verify_delete_modal';
	private VERIFY_CLEANUP_BUTTON: string = 'confirm_delete_workshop_button';
	private DELETE_STATUS_MODAL: string = 'delete_status_modal';
	private DELETE_SUCCESS: string = 'delete_success_id';
	private CLOSE_DELETION_STATUS_MODAL: string = 'close_deletion_status';

	// SELECT WORKSHOP
	private WORKSHOP_OPTION: string = 'select_workshop_';

	// WORKSHOP MEMBERS
	private USER_ROW_PREFIX: string = 'user_';
	private USER_ROLE_PREFIX: string = 'user_role_';
	private PARTICIPANT: string = 'Participant';
	private ADMIN: string = 'Admin';
	private VM_NAME_PREFIX: string = 'vm_name_';
	private RESENV_URL_PREFIX: string = 'resenv_url_';

	readonly page: Page;
	readonly baseURL: string;

	constructor(page: Page, baseURL) {
		this.page = page;
		this.baseURL = baseURL;
	}

	async goToWorkshopOverview() {
		console.log('Goto Workshop overview Page');
		await this.page.goto(`${this.baseURL}/#/virtualmachines/workshopOverview`, { waitUntil: 'networkidle' });
		console.log(this.page.url());
		expect(this.page.url()).toContain('/virtualmachines/workshopOverview');
		console.log(await this.page.title());
	}

	async selectProject(project_name: string = Util.WORKSHOP_PROJECT_NAME) {
		console.log('Selecting project');
		await this.page.waitForTimeout(2000);
		await this.page.locator(Util.by_data_test_id_str(this.PROJECT_SELECT)).isVisible();
		await this.page.selectOption(Util.by_data_test_id_str(this.PROJECT_SELECT), { label: project_name });
		await this.page.locator(Util.by_data_test_id_str(this.NEW_WORKSHOP_BUTTON)).isVisible();
		console.log('Project selected');
	}

	async createNewWorkshop(workshop_name: string = Util.WORKSHOP_NAME) {
		await this.page.locator(Util.by_data_test_id_str(this.NEW_WORKSHOP_BUTTON)).click();
		await this.page.type(Util.by_data_test_id_str(this.LONGNAME_FIELD), workshop_name);
		await this.page.type(Util.by_data_test_id_str(this.SHORTNAME_FIELD), workshop_name);
		await this.page.locator(Util.by_data_test_id_str(this.CREATE_WORKSHOP_BUTTON)).click();
	}

	async waitForSuccess() {
		await this.page.locator(Util.by_data_test_id_str(this.CREATION_STATUS_MODAL)).isVisible();
		await this.page.locator(Util.by_data_test_id_str(this.CREATION_STATUS_MESSAGE_FIELD)).isVisible();
		await this.page.locator(Util.by_data_test_id_str(this.SUCCESS_ALERT)).isVisible();
		await this.page.locator(Util.by_data_test_id_str(this.CLOSE_CEATION_STATUS_MODAL)).click();
	}

	async waitForError() {
		await this.page.locator(Util.by_data_test_id_str(this.CREATION_STATUS_MODAL)).isVisible();
		await this.page.locator(Util.by_data_test_id_str(this.CREATION_STATUS_MESSAGE_FIELD)).isVisible();
		await this.page.locator(Util.by_data_test_id_str(this.ERROR_ALERT)).isVisible();
		await this.page.locator(Util.by_data_test_id_str(this.CLOSE_CEATION_STATUS_MODAL)).click();
	}

	async createNewWorkshopWithSuccess(workshop_name: string = Util.WORKSHOP_NAME) {
		await this.createNewWorkshop(workshop_name);
		await this.waitForSuccess();
	}

	async createNewWorkshopWithError(workshop_name: string = Util.WORKSHOP_NAME) {
		await this.createNewWorkshop(workshop_name);
		await this.waitForError();
	}

	async selectWorkshop(workshop_name: string = Util.WORKSHOP_NAME) {
		console.log(`Selecting workshop ${workshop_name}`);
		await this.page.locator(Util.by_data_test_id_str(`${this.WORKSHOP_OPTION}${workshop_name}`)).click();
	}

	async hasUser(user_elixir_id: string) {
		await this.page.locator(Util.by_data_test_id_str(`${this.USER_ROW_PREFIX}${user_elixir_id}`)).isVisible();
	}

	async userIsParticipant(user_elixir_id: string) {
		await this.hasUser(user_elixir_id);
		await this.page.waitForSelector(
			`data-test-id=${this.USER_ROLE_PREFIX}${user_elixir_id} >> text=${this.PARTICIPANT}`,
		);
	}

	async userIsAdmin(user_elixir_id: string) {
		await this.hasUser(user_elixir_id);
		await this.page.waitForSelector(`data-test-id=${this.USER_ROLE_PREFIX}${user_elixir_id} >> text=${this.ADMIN}`);
	}

	async deleteWorkshop() {
		await this.page.locator(Util.by_data_test_id_str(this.CLEANUP_WORKSHOP_BUTTON)).click();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_CLEANUP_MODAL)).isVisible();
		await this.page.locator(Util.by_data_test_id_str(this.VERIFY_CLEANUP_BUTTON)).click();
		await this.page.locator(Util.by_data_test_id_str(this.DELETE_STATUS_MODAL)).isVisible();
		await this.page.locator(Util.by_data_test_id_str(this.DELETE_SUCCESS)).isVisible();
		await this.page.locator(Util.by_data_test_id_str(this.CLOSE_DELETION_STATUS_MODAL)).click();
	}

	async workshopHasVms(elixir_ids: string[]) {
		for (const elixir_id of elixir_ids) {
			// eslint-disable-next-line no-await-in-loop
			await this.getVmOfUser(elixir_id);
		}
	}

	async getResenvUrlOfUser(elixir_id: string): Promise<string> {
		const vm_name: string = await this.getVmOfUser(elixir_id);

		return this.getResEnvUrlOfVm(vm_name);
	}

	async getVmOfUser(elixir_id: string): Promise<string> {
		const name = await this.page.locator(Util.by_data_test_id_str(`${this.VM_NAME_PREFIX}${elixir_id}`)).textContent();

		return name.trim();
	}

	async getResEnvUrlOfVm(vm_name: string): Promise<string> {
		return await this.page.locator(Util.by_data_test_id_str(`${this.RESENV_URL_PREFIX}${vm_name}`)).textContent();
	}

	async visitResEnv(url: string) {
		const response: Response = await this.page.goto(url, { waitUntil: 'networkidle' });

		expect(response.status()).toEqual(200);
	}
}
