// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-extraneous-dependencies
import { expect, Page } from '@playwright/test';
import { Util } from '../util';

/**
 * Workshop instances Page.
 */
export class WorkshopInstancesPage {
	private PROJECT_SELECT: string = 'projectSelect';
	private WORKSHOP_OPTION: string = 'workshop_option_';
	private FLAVOR_PREFIX: string = 'flavor_';
	private IMAGE_PREFIX: string = 'image_';
	private RESENV_PREFIX: string = 'add_resenv_template_';
	private ADD_USER_PREFIX: string = 'add_user_';
	private ANSIBLE_OKAY_CHECKBOX: string = 'ansible_need_okay';
	private RESPONSIBILITY_CHECKBOX: string = 'vm_responsibility';
	private START_VMS_BUTTON: string = 'startVMButton';
	private REDIRECT_MODAL: string = 'redirect_modal';

	readonly page: Page;
	readonly baseURL: string;

	constructor(page: Page, baseURL) {
		this.page = page;
		this.baseURL = baseURL;
	}

	async goToWorkshopInstances() {
		console.log('Goto Workshop instances Page');
		await this.page.goto(`${this.baseURL}/#/virtualmachines/newWorkshop`, { waitUntil: 'networkidle' });
		console.log(this.page.url());
		expect(this.page.url()).toContain('/virtualmachines/newWorkshop');
	}

	async selectProject(project_name: string = Util.WORKSHOP_PROJECT_NAME) {
		console.log('Selecting project');
		await this.page.waitForTimeout(2000);
		await this.page.locator(Util.by_data_test_id_str(this.PROJECT_SELECT)).isVisible();
		await this.page.selectOption(Util.by_data_test_id_str(this.PROJECT_SELECT), { label: project_name });
		console.log('Project selected');
	}
	async selectWorkshop(workshop_name: string = Util.WORKSHOP_NAME) {
		await this.page.locator(Util.by_data_test_id_str(`${this.WORKSHOP_OPTION}${workshop_name}`)).click();
	}

	async startVMsForUsers(elixir_id_list: string[]) {
		await this.fillForm(Util.DEFAULT_FLAVOR_NAME, Util.UBUNTU_18_TITLE, Util.CWLAB, elixir_id_list);
	}

	async fillForm(flavor: string, image: string, resenv: string, user_elixir_ids: string[]) {
		await this.page.locator(Util.by_data_test_id_str(`${this.FLAVOR_PREFIX}${flavor}`)).click();
		await this.page.locator(Util.by_data_test_id_str(`${this.IMAGE_PREFIX}${image}`)).click();
		await this.page.locator(Util.by_data_test_id_str(`${this.RESENV_PREFIX}${resenv}`)).click();
		for (const user_elixir_id of user_elixir_ids) {
			// eslint-disable-next-line no-await-in-loop
			await this.page.locator(Util.by_data_test_id_str(`${this.ADD_USER_PREFIX}${user_elixir_id}`)).click();
		}
		await this.page.locator(Util.by_data_test_id_str(this.ANSIBLE_OKAY_CHECKBOX)).click();
		await this.page.locator(Util.by_data_test_id_str(this.RESPONSIBILITY_CHECKBOX)).click();
		await this.page.locator(Util.by_data_test_id_str(this.START_VMS_BUTTON)).click();
		await this.page.locator(Util.by_data_test_id_str(this.REDIRECT_MODAL)).isVisible();
	}
}
