import { browser } from 'protractor';
import { Util } from '../util';

/**
 * Workshop Overview Page.
 */
export class WorkshopOverviewPage {
	private static WORKSHOP_OVERVIEW_URL: string = 'virtualmachines/workshopOverview';
	private static PROJECTS_EXISTING: string = 'projectsExisting';
	private static PROJECT_SELECT: string = 'projectSelect';
	private static PROJECT_OPTION: string = `project_option_${Util.SIMPLE_VM_APPLICATION_NAME}`;
	private static NEW_WORKSHOP_BUTTON: string = 'new_workshop_button_id';
	private static CREATE_WORKSHOP_BUTTON: string = 'create_workshop_button_id';
	private static CREATION_STATUS_MODAL: string = 'creation_status_modal';
	private static CREATION_STATUS_MESSAGE_FIELD: string = 'creation_status_message';
	private static SUCCESS_ALERT: string = 'creation_success';
	private static ERROR_ALERT: string = 'creation_failure'
	private static CLOSE_CEATION_STATUS_MODAL: string = 'close_creation_status_modal';
	private static LONGNAME_FIELD: string = 'workshop_longname';
	private static SHORTNAME_FIELD: string = 'workshop_shortname';
	private static WORKSHOP_OPTION: string = `select_workshop_${Util.WORKSHOP_NAME}_btn`;
	private static USER_NAME_FIELD_PREFIX: string = 'user_name_field_prefix_';
	private static CLEANUP_WORKSHOP_BUTTON: string = 'cleanup_workshop_button_id';
	private static VERIFY_CLEANUP_MODAL: string = 'verify_delete_modal';
	private static VERIFY_CLEANUP_BUTTON: string = 'confirm_delete_workshop_button';
	private static DELETE_STATUS_MODAL: string = 'delete_status_modal';
	private static DELETE_SUCCESS: string = 'delete_success_id';
	private static CLOSE_DELETION_STATUS_MODAL: string = 'close_deletion_status';
	private static VM_NAME_PREFIX: string = 'vm_name_';
	private static RESENV_URL_PREFIX: string = 'resenv_url_';

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
		await Util.waitForPresenceOfElementById(this.CREATION_STATUS_MODAL);
		await Util.waitForPresenceOfElementById(this.CREATION_STATUS_MESSAGE_FIELD);

		return Util.waitForPresenceOfElementById(this.SUCCESS_ALERT);
	}

	static async newWorkshopError(): Promise<boolean> {
		Util.logInfo(`Checking error for new Workshop ${Util.WORKSHOP_NAME}`);
		await Util.waitForPresenceOfElementById(this.CREATION_STATUS_MODAL);
		await Util.waitForPresenceOfElementById(this.CREATION_STATUS_MESSAGE_FIELD);

		return Util.waitForPresenceOfElementById(this.ERROR_ALERT);
	}

	static async workshopHasUser(): Promise<boolean> {
		Util.logInfo(`Checking if user ${Util.VO_ACCOUNT_ELIXIR_ID} exists for Workshop ${Util.WORKSHOP_NAME}`);
		await this.selectWorkshop();

		return Util.waitForPresenceOfElementById(`${this.USER_NAME_FIELD_PREFIX}${Util.VO_ACCOUNT_ELIXIR_ID}`);
	}

	static async workshopHasAdmin(): Promise<boolean> {
		Util.logInfo(`Checking if admin ${Util.USER_ACCOUNT_ELIXIR_ID} exists for Workshop ${Util.WORKSHOP_NAME}`);
		await this.selectWorkshop();

		return Util.waitForPresenceOfElementById(`${this.USER_NAME_FIELD_PREFIX}${Util.USER_ACCOUNT_ELIXIR_ID}`);
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
		await Util.clickElementById(this.VERIFY_CLEANUP_BUTTON);
		await Util.waitForPresenceOfElementById(this.DELETE_STATUS_MODAL);

		return Util.waitForPresenceOfElementById(this.DELETE_SUCCESS);
	}

	static async selectWorkshop(): Promise<any> {
		Util.logInfo(`Selecting Workshop ${Util.WORKSHOP_NAME}`);
		await Util.waitForElementToBeClickableById(this.WORKSHOP_OPTION);
		await Util.clickElementById(this.WORKSHOP_OPTION);
	}

	static async workshopHasVms(): Promise<any> {
		const vmNames: string[] = [];
		vmNames.push(await this.getVmOfUser(Util.USER_ACCOUNT_ELIXIR_ID));
		vmNames.push(await this.getVmOfUser(Util.VO_ACCOUNT_ELIXIR_ID));

		return vmNames;
	}

	static async getResenvUrlOfUser(): Promise<string> {
		return this.getResEnvUrlOfVm(
			await this.getVmOfUser(Util.VO_ACCOUNT_ELIXIR_ID),
		);
	}

	static async getResenvUrlOfAdmin(): Promise<string> {
		return this.getResEnvUrlOfVm(
			await this.getVmOfUser(Util.USER_ACCOUNT_ELIXIR_ID),
		);
	}

	static async getVmOfUser(elixirId: string): Promise<string> {
		return Util.getElemTextById(`${this.VM_NAME_PREFIX}${elixirId}`);
	}

	static async getResEnvUrlOfVm(vmName: string): Promise<string> {
		return Util.getElemTextById(`${this.RESENV_URL_PREFIX}${vmName}`);
	}

	static async closeCreationStatusModal(): Promise<any> {
		await Util.waitForPresenceOfElementById(this.CLOSE_CEATION_STATUS_MODAL);
		await Util.waitForElementToBeClickableById(this.CLOSE_CEATION_STATUS_MODAL);
		await Util.clickElementById(this.CLOSE_CEATION_STATUS_MODAL);
	}

	static async closeWorkshopCleanupModal(): Promise<any> {
		await Util.waitForPresenceOfElementById(this.CLOSE_DELETION_STATUS_MODAL);
		await Util.waitForElementToBeClickableById(this.CLOSE_DELETION_STATUS_MODAL);
		await Util.clickElementById(this.CLOSE_DELETION_STATUS_MODAL);
	}
}
