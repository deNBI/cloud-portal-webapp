import { browser, by, element } from 'protractor';
import { Util } from '../util';

/**
 * Workshop vm page
 */
export class WorkshopVMPage {
	private static WORKSHOP_VM_URL: string = 'virtualmachines/newWorkshop';
	private static PROJECTS_EXISTING: string = 'projectsExisting';
	private static PROJECT_SELECT: string = 'projectSelect';
	private static PROJECT_OPTION: string = `project_option_${Util.SIMPLE_VM_APPLICATION_NAME}`;
	private static WORKSHOP_OPTION: string = `workshop_option_${Util.WORKSHOP_NAME}`;
	private static FLAVOR_ID: string = 'id_flavor_detail';
	private static FLAVOR_PREFIX: string = 'id_flavor_owl_';
	private static IMAGE_ID: string = 'id_image_detail';
	private static IMAGE_PREFIX: string = 'id_image_owl_';
	private static RESENV_ID: string = 'id_resenv';
	private static RESENV_PREFIX: string = 'id_template_owl_';
	private static ADD_USER_PREFIX: string = 'add_user_';
	private static ANSIBLE_OKAY_CHECKBOX: string = 'ansible_need_okay';
	private static RESPONSIBILITY_CHECKBOX: string = 'vm_responsibility';
	private static START_VMS_BUTTON: string = 'startVMButton';
	private static REDIRECT_MODAL: string = 'redirect_modal';

	static async navigateToAddWorkshopVm(): Promise<any> {
		Util.logInfo('Navigating to Workshop new VM Page');
		await Util.navigateToAngularPage(this.WORKSHOP_VM_URL);
		await Util.waitForPage(this.WORKSHOP_VM_URL);

		return browser.driver.sleep(10000);
	}

	static async selectProject(): Promise<any> {
		await Util.waitForPresenceOfElementById(this.PROJECTS_EXISTING);
		Util.logInfo(`Selecting project ${this.PROJECT_OPTION}`);
		await Util.waitForPresenceOfElementById(this.PROJECT_SELECT);
		await Util.waitForElementToBeClickableById(this.PROJECT_SELECT);
		Util.logInfo('Getting option from select');
		await Util.clickOptionOfSelect(this.PROJECT_OPTION, this.PROJECT_SELECT);
	}

	static async selectWorkshop(): Promise<any> {
		await Util.waitForElementToBeClickableById(this.WORKSHOP_OPTION);
		await Util.clickElementById(this.WORKSHOP_OPTION);
	}

	static async startVMsForUserAndAdmin(): Promise<any> {
		await this.fillForm(
			Util.DEFAULT_FLAVOR_NAME,
			Util.UBUNTU_18_TITLE,
			Util.CWLAB,
			[Util.USER_ACCOUNT_ELIXIR_ID, Util.VO_ACCOUNT_ELIXIR_ID],
		);
	}

	static async isRedirectModalPresent(): Promise<boolean> {
		return Util.waitForPresenceOfElementById(this.REDIRECT_MODAL);
	}

	static async fillForm(flavor: string, image: string, resenv: string, userElixirIds: string[]): Promise<any> {
		await Util.waitForPresenceOfElementById(this.FLAVOR_ID);
		await element(by.id(this.FLAVOR_ID)).element(by.id(`${this.FLAVOR_PREFIX}${flavor}`)).click();
		await Util.waitForPresenceOfElementById(this.IMAGE_ID);
		await element(by.id(this.IMAGE_ID)).element(by.id(`${this.IMAGE_PREFIX}${image}`)).click();
		await Util.waitForPresenceOfElementById(this.RESENV_ID);
		await element(by.id(this.RESENV_ID)).element(by.id(`${this.RESENV_PREFIX}${resenv}`)).click();
		for (const userElixirId of userElixirIds) {
			// eslint-disable-next-line no-await-in-loop
			await Util.waitForPresenceOfElementById(`${this.ADD_USER_PREFIX}${userElixirId}`);
			// eslint-disable-next-line no-await-in-loop
			await Util.clickElementById(`${this.ADD_USER_PREFIX}${userElixirId}`);
		}
		await Util.waitForElementToBeClickableById(this.ANSIBLE_OKAY_CHECKBOX);
		await Util.clickElementById(this.ANSIBLE_OKAY_CHECKBOX);
		await Util.waitForElementToBeClickableById(this.RESPONSIBILITY_CHECKBOX);
		await Util.clickElementById(this.RESPONSIBILITY_CHECKBOX);
		await Util.waitForElementToBeClickableById(this.START_VMS_BUTTON);
		await Util.clickElementById(this.START_VMS_BUTTON);
	}

}
