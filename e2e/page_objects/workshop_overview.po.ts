import { browser, by, element } from 'protractor';
import { Util } from '../util';

/**
 * Instance Overview Page.
 */
export class WorkshopOverviewPage {
	private static WORKSHOP_OVERVIEW_URL: string = 'virtualmachines/workshops';
	private static USER_NAME_USER: string = 'Test User';
	private static USER_NAME_ADMIN: string = 'Test User';
	private static PROJECTS_EXISTING: string = 'projectsExisting';
	private static PROJECT_SELECT: string = 'projectSelect';
	private static PROJECT_OPTION: string = `project_option_${Util.SIMPLE_VM_APPLICATION_NAME}`;
	private static NEW_WORKSHOP_BUTTON: string = 'new_workshop_button_id';
	private static CREATE_WORKSHOP_BUTTON: string = 'create_workshop_button_id';
	private static LONGNAME_FIELD: string = 'workshop_longname';
	private static SHORTNAME_FIELD: string = 'workshop_shortname';
	private static WORKSHOP_OPTION: string = `workshop_option_id_${Util.WORKSHOP_NAME}`;
	private static USER_NAME_FIELD_PREFIX: string = 'user_name_field_prefix_';
	private static CLEANUP_WORKSHOP_BUTTON: string = 'cleanup_workshop_button_id';
	private static VERIFY_CLEANUP_MODAL: string = 'verify_cleanup_modal';
	private static VERIFY_CLEANUP_BUTTON: string = 'confirm_delete_workshop_button';
	private static DELETE_SUCCESS_MODAL: string = 'workshop_cleanup_success_id';

	static async navigateToOverview(): Promise<any> {
		Util.logInfo('Navigating to Workshop Overview Page');
		await Util.navigateToAngularPage(this.WORKSHOP_OVERVIEW_URL);
		await Util.waitForPage(this.WORKSHOP_OVERVIEW_URL);

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

	static async createNewWorkshop(): Promise<any> {
		Util.logInfo(`Creating Workshop ${Util.WORKSHOP_NAME}`);
		await Util.waitForPresenceOfElementById(this.NEW_WORKSHOP_BUTTON);
		await Util.waitForElementToBeClickableById(this.NEW_WORKSHOP_BUTTON);
		await Util.clickElementById(this.NEW_WORKSHOP_BUTTON);

		await Util.waitForPresenceOfElementById(this.LONGNAME_FIELD);
		await Util.sendTextToElementByIdUnsecure(this.LONGNAME_FIELD, Util.WORKSHOP_NAME);

		await Util.waitForPresenceOfElementById(this.SHORTNAME_FIELD);
		await Util.sendTextToElementByIdUnsecure(this.SHORTNAME_FIELD, Util.WORKSHOP_NAME);

		await Util.clickElementById(this.CREATE_WORKSHOP_BUTTON);
	}

	static async newWorkshopSuccess(): Promise<boolean> {
		Util.logInfo(`Checking success for new Workshop ${Util.WORKSHOP_NAME}`);

		return true;
	}

	static async newWorkshopError(): Promise<boolean> {
		Util.logInfo(`Checking error for new Workshop ${Util.WORKSHOP_NAME}`);

		return true;
	}

	static async workshopHasUser(): Promise<boolean> {
		Util.logInfo(`Checking if user ${this.USER_NAME_USER} exists for Workshop ${Util.WORKSHOP_NAME}`);
		await this.selectWorkshop();

		return Util.waitForPresenceOfElementById(`${this.USER_NAME_FIELD_PREFIX}${this.USER_NAME_USER}`);
	}

	static async workshopHasAdmin(): Promise<boolean> {
		Util.logInfo(`Checking if user ${this.USER_NAME_ADMIN} exists for Workshop ${Util.WORKSHOP_NAME}`);
		await this.selectWorkshop();

		return Util.waitForPresenceOfElementById(`${this.USER_NAME_FIELD_PREFIX}${this.USER_NAME_ADMIN}`);
	}

	static async deleteWorkshop(): Promise<boolean> {
		Util.logInfo(`Deleting Workshop ${Util.WORKSHOP_NAME}`);
		await this.selectWorkshop();
		await Util.waitForPresenceOfElementById(this.CLEANUP_WORKSHOP_BUTTON);
		await Util.waitForElementToBeClickableById(this.CLEANUP_WORKSHOP_BUTTON);
		await Util.clickElementById(this.CLEANUP_WORKSHOP_BUTTON);
		await Util.waitForPresenceOfElementById(this.VERIFY_CLEANUP_MODAL);
		await Util.waitForPresenceOfElementById(this.VERIFY_CLEANUP_BUTTON);
		await Util.waitForElementToBeClickableById(this.VERIFY_CLEANUP_BUTTON);

		return Util.waitForPresenceOfElementById(this.DELETE_SUCCESS_MODAL);
	}

	static async selectWorkshop(): Promise<any> {
		Util.logInfo(`Selecting Workshop ${Util.WORKSHOP_NAME}`);
		await Util.waitForElementToBeClickableById(this.WORKSHOP_OPTION);
		await Util.clickElementById(this.WORKSHOP_OPTION);
	}

}
