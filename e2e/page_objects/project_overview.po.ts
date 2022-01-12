import { browser } from 'protractor';
import { Util } from '../util';

/**
 * Project Overview page.
 */
export class ProjectOverview {

	private static PI_USER_TAB: string = 'pi_user_tab';
	private static PI_EMAIL_FIELD: string = 'id_pi_email';
	private static VALIDATION_HASH: string = 'validation_hash';
	private static INFORMATION_TAB: string = 'information_tab';
	private static ADD_MEMBER_BTN_MODAL: string = 'add_member_btn_modal';
	private static SEARCH_MEMBER: string = 'add_member_input';
	private static DEFAULT_MEMBER_EMAIL: string = 'testuserdenbi';
	private static DEFAULT_MEMBER: string = 'Test User';
	private static ADD_MEMBER_BTN: string = 'add_member_btn';
	private static SEARCH_MEMBER_BTN: string = 'search_member_btn';
	private static SUCCESS: string = 'Success';
	private static REMOVE_MEMBER_PREFIX: string = 'remove_member_';
	private static NOTIFICATION_TITLE: string = 'notification_title';
	private static NOTIFICATION_CLOSE: string = 'close_notification';
	private static CLOSE_ADD_MEMBER_MODAL_BTN: string = 'close_add_user_modal_btn';
	private static MODIFICATION_REQUEST_RESULT: string = 'extension_result_submitted';
	private static MODIFICATION_REQUEST_SUCCESS_TEXT: string = 'Modification request successfully submitted!';
	private static EXTENSION_REQUEST_SUCCESS_TEXT: string = 'Lifetime extension request successfully submitted!';
	private static DENBI_DEFAULT_OLD_ID: string = 'de.NBI default_old';
	private static DENBI_DEFAULT_NEW_INPUT: string = 'de.NBI default';
	private static OLD_VOLUME_COUNTER_ID: string = 'project_application_volume_counter';
	private static NEW_VOLUME_COUNTER_ID: string = 'id_project_application_renewal_volume_counter';
	private static OLD_VOLUME_LIMIT_ID: string = 'project_application_volume_limit';
	private static NEW_VOLUME_LIMIT_ID: string = 'id_project_application_renewal_volume_limit';
	private static OLD_OBJECT_STORAGE_ID: string = 'project_application_object_storage';
	private static NEW_OBJECT_STORAGE_ID: string = 'id_project_application_renewal_object_storage';
	private static TOTAL_RAM: string = 'total_ram_label';
	private static TOTAL_CORES: string = 'total_cores_label';
	private static BIOINFORMATICS_TOPIC: string = 'topic_Bioinformatics';
	private static SHOW_INFORMATION_BTN: string = 'show_information_btn';
	private static SUBMITTED_SHOW_INFORMATION_BTN: string = 'submitted_show_information_btn';
	private static DISSEMINATION_PLATFORM_LIST: string = 'dissemination_platforms';
	private static DISSEMINATION_INFORMATION_LIST: string = 'dissemination_information';
	// eslint-disable-next-line max-len
	private static DEFAULT_INFORMATION_DISSEMINATION_STRING: string = 'Title, Research Topics, Description, Resources, Lifetime, Project Type, Name of PI, Institution, Workgroup, Project affiliation';
	private static DEFAULT_PLATFORM_DISSEMINATION_STRING: string = 'de.NBI Platforms, Twitter';
	private static PI_ROW: string = 'id_pi_row';
	private static REMOVE_APPLICATION_BUTTON: string = 'remove_application_button';
	private static REMOVE_APPLICATION_MODAL: string = 'remove_application_modal';
	private static CONFIRM_REMOVE_APPLICATION_BUTTON: string = 'confirm_remove_application_button';
	private static MODIFICATION_REQUEST_BUTTON: string = 'show_modification_extension_button';
	private static NO_DOI_BUTTON: string = 'no_new_dois_btn';
	private static SUBMIT_MODIFICATION_BUTTON: string = 'submit_modification_btn';
	private static CONFIRM_MODIFICATION_BUTTON: string = 'confirm_modification_btn';
	private static SHOW_DOI_MODAL: string = 'show_doi_question_modal';
	private static EXTENSION_LIFETIME_INPUT: string = 'temp_project_extension_application_renewal_lifetime';
	private static SUBMIT_EXTENSION_BUTTON: string = 'submit_extension_btn';
	private static CONFIRM_EXTENSION_BUTTON: string = 'confirm_extension_btn';
	private static PROJECT_LIST_FOLDED: string = 'project_list_folded';
	private static PROJECT_LIST_FOLDED_TOGGLER: string = 'project_list_folded_toggler';
	private static PROJECT_LIST: string = 'project_list';
	private static EXTENSION_REQUEST_RESULT: string = 'extension_result_submitted';

	static async navigateToSimpleProjectverview(): Promise<any> {
		Util.logInfo('Navigating to simple project overview');
		await browser.sleep(5000);
		if (await Util.isElementPresentById(this.PROJECT_LIST_FOLDED)) {
			await this.navigateToSimpleProjectoverviewByProjectsThenByClick();
		} else {
			await this.navigateToSimpleProjectoverviewByClick();
		}
	}

	static async navigateToSimpleProjectoverviewByClick(): Promise<any> {
		await Util.clickElementById(Util.SIMPLE_VM_APPLICATION_NAME);
	}

	static async navigateToSimpleProjectoverviewByProjectsThenByClick(): Promise<any> {
		await Util.clickElementById(this.PROJECT_LIST_FOLDED_TOGGLER);
		await Util.clickElementById(Util.SIMPLE_VM_APPLICATION_NAME);
	}

	static async navigateToPIApproval(): Promise<any> {
		Util.logInfo('Navigating to Approval of PI');
		await Util.clickElementById(this.INFORMATION_TAB);
		await Util.waitForPresenceOfElementById(this.VALIDATION_HASH);
		await Util.clickElementById(this.VALIDATION_HASH);
	}

	static async checkForPIApproval(): Promise<boolean> {
		Util.logInfo('Checking if PI-Mail is present');
		await Util.waitForPresenceOfElementById(this.SUBMITTED_SHOW_INFORMATION_BTN);
		await Util.clickElementById(this.SUBMITTED_SHOW_INFORMATION_BTN);
		await Util.waitForPresenceOfElementById(this.PI_USER_TAB);
		await Util.clickElementById(this.PI_USER_TAB);
		await Util.waitForPresenceOfElementById(this.PI_EMAIL_FIELD);
		const piMail: string = await Util.getElemTextById(this.PI_EMAIL_FIELD);

		return !!(typeof (piMail) !== 'undefined' && piMail);
	}

	static async navigateToOpenStackeProjectverview(): Promise<any> {
		Util.logInfo('Navigating to openstack project overview');
		await browser.sleep(5000);
		if (await Util.isElementPresentById(this.PROJECT_LIST_FOLDED)) {
			await this.navigateToOpenstackProjectoverviewByProjectsThenByClick();
		} else {
			await this.navigateToOpenstackProjectoverviewByClick();
		}
	}

	static async navigateToOpenstackProjectoverviewByClick(): Promise<any> {
		await Util.clickElementById(Util.OPENSTACK_APPLICATION_NAME);
	}

	static async navigateToOpenstackProjectoverviewByProjectsThenByClick(): Promise<any> {
		await Util.clickElementById(this.PROJECT_LIST_FOLDED_TOGGLER);
		await Util.clickElementById(Util.OPENSTACK_APPLICATION_NAME);
	}

	static async isDisseminationSet(): Promise<any> {
		Util.logInfo('Check if dissemination is set');
		await Util.waitForTextPresenceInElementById(this.DISSEMINATION_INFORMATION_LIST, this.DEFAULT_INFORMATION_DISSEMINATION_STRING);
		await Util.waitForTextPresenceInElementById(this.DISSEMINATION_PLATFORM_LIST, this.DEFAULT_PLATFORM_DISSEMINATION_STRING);
	}

	static async hasPi(): Promise<boolean> {
		Util.logInfo('Check if pi is set');
		await Util.clickElementById(this.SUBMITTED_SHOW_INFORMATION_BTN);

		return await Util.waitForAbsenceOfElementById(this.PI_ROW);

	}

	static async copyPIHash(): Promise<string> {
		await Util.waitForPresenceOfElementById(this.INFORMATION_TAB);
		await Util.clickElementById(this.INFORMATION_TAB);
		await Util.waitForPresenceOfElementById(this.VALIDATION_HASH);

		return await Util.getElemTextById(this.VALIDATION_HASH);

	}

	static async addMemberToProject(application_name: string, member: string = this.DEFAULT_MEMBER_EMAIL): Promise<any> {
		Util.logInfo('Open add member modal');
		await Util.clickElementById(this.ADD_MEMBER_BTN_MODAL);
		await Util.sendTextToElementByIdUnsecure(this.SEARCH_MEMBER, member);
		await Util.clickElementById(this.SEARCH_MEMBER_BTN);
		await Util.clickElementById(this.ADD_MEMBER_BTN);
		await Util.waitForTextPresenceInElementById(this.NOTIFICATION_TITLE, this.SUCCESS);
		Util.logInfo('Close Modal');
		await Util.clickElementById(this.NOTIFICATION_CLOSE);
		await Util.clickElementById(this.CLOSE_ADD_MEMBER_MODAL_BTN);
		await browser.sleep(1000);

	}

	static async removeMemberFromProject(application_name: string, member: string = this.DEFAULT_MEMBER): Promise<any> {
		await Util.clickElementById(this.REMOVE_MEMBER_PREFIX + member);
		await Util.waitForTextPresenceInElementById(this.NOTIFICATION_TITLE, this.SUCCESS);
		Util.logInfo('Close Modal');

		await Util.clickElementById(this.NOTIFICATION_CLOSE);
		await browser.sleep(1000);

	}

	static async openModificationModal(appication_name: string): Promise<any> {
		await Util.waitForPresenceOfElementById(this.MODIFICATION_REQUEST_BUTTON);
		await Util.clickElementById(this.MODIFICATION_REQUEST_BUTTON);
	}

	static async openExtensionModal(application_Name: string): Promise<any> {
		await Util.waitForPresenceOfElementById(this.SHOW_DOI_MODAL);
		await Util.clickElementById(this.SHOW_DOI_MODAL);
		await Util.waitForPresenceOfElementById(this.NO_DOI_BUTTON);
		await Util.clickElementById(this.NO_DOI_BUTTON);
	}

	static async sendModificationRequest(application_name: string): Promise<any> {
		await Util.waitForPresenceOfElementById(this.SUBMIT_MODIFICATION_BUTTON);
		await Util.clickElementById(this.SUBMIT_MODIFICATION_BUTTON);
		await Util.waitForPresenceOfElementById(this.CONFIRM_MODIFICATION_BUTTON);
		await Util.clickElementById(this.CONFIRM_MODIFICATION_BUTTON);
		await Util.waitForTextPresenceInElementById(this.MODIFICATION_REQUEST_RESULT, this.MODIFICATION_REQUEST_SUCCESS_TEXT);
	}

	static async sendExtensionRequest(application_name: string): Promise<any> {
		await Util.waitForPresenceOfElementById(this.SUBMIT_EXTENSION_BUTTON);
		await Util.clickElementById(this.SUBMIT_EXTENSION_BUTTON);
		await Util.waitForPresenceOfElementById(this.CONFIRM_EXTENSION_BUTTON);
		await Util.clickElementById(this.CONFIRM_EXTENSION_BUTTON);
		await Util.waitForTextPresenceInElementById(this.EXTENSION_REQUEST_RESULT, this.EXTENSION_REQUEST_SUCCESS_TEXT);
	}

	static async isBioinformaticsSet(): Promise<any> {
		await Util.clickElementById(this.SUBMITTED_SHOW_INFORMATION_BTN);
		await Util.clickElementById(this.INFORMATION_TAB);
		await Util.waitForPresenceOfElementById(this.BIOINFORMATICS_TOPIC);
	}

	static async areDefaultValuesSetSimpleVM(): Promise<any> {
		await Util.checkInputsByIdsGotSameValue(this.DENBI_DEFAULT_OLD_ID, this.DENBI_DEFAULT_NEW_INPUT);
		await Util.checkInputsByIdsGotSameValue(this.OLD_VOLUME_COUNTER_ID, this.NEW_VOLUME_COUNTER_ID);
		await Util.checkInputsByIdsGotSameValue(this.OLD_VOLUME_LIMIT_ID, this.NEW_VOLUME_LIMIT_ID);

	}

	static async areDefaultValuesSetOpenstack(): Promise<any> {
		await Util.checkInputsByIdsGotSameValue(this.DENBI_DEFAULT_OLD_ID, this.DENBI_DEFAULT_NEW_INPUT);
		await Util.checkInputsByIdsGotSameValue(this.OLD_VOLUME_COUNTER_ID, this.NEW_VOLUME_COUNTER_ID);
		await Util.checkInputsByIdsGotSameValue(this.OLD_VOLUME_LIMIT_ID, this.NEW_VOLUME_LIMIT_ID);
		await Util.checkInputsByIdsGotSameValue(this.OLD_OBJECT_STORAGE_ID, this.NEW_OBJECT_STORAGE_ID);

	}

	static async checkTotalCoresRam(): Promise<any> {
		Util.logInfo('Check cores and ram');
		const counter: string = await Util.getInputValueById(this.DENBI_DEFAULT_NEW_INPUT);
		const cores: string = await Util.getElemTextById(`${this.DENBI_DEFAULT_NEW_INPUT}_cores`);
		const ram: string = await Util.getElemTextById(`${this.DENBI_DEFAULT_NEW_INPUT}_ram`);
		const total_ram: number = parseInt(await Util.getElemTextById(this.TOTAL_RAM), 10);
		const total_cores: number = parseInt(await Util.getElemTextById(this.TOTAL_CORES), 10);
		const total_cores_calc: number = parseInt(cores, 10) * parseInt(counter, 10);
		const total_ram_calc: number = parseInt(ram, 10) * parseInt(counter, 10);
		expect(total_ram).toEqual(total_ram_calc);
		expect(total_cores_calc).toEqual(total_cores);

	}

	static async fillModificationRequest(): Promise<any> {
		await Util.sendTextToElementByIdUnsecure(this.DENBI_DEFAULT_NEW_INPUT, '5');
		await Util.sendTextToElementByIdUnsecure(this.NEW_VOLUME_COUNTER_ID, '1');
		await Util.sendTextToElementByIdUnsecure(this.NEW_VOLUME_LIMIT_ID, '1');
		await Util.sendTextToElementByIdUnsecure('id_project_application_renewal_comment', 'This is a Protrector test modification!');
	}

	static async fillExtensionRequest(): Promise<any> {
		await Util.waitForPresenceOfElementById(this.EXTENSION_LIFETIME_INPUT);
		await Util.sendTextToElementByIdUnsecure(this.EXTENSION_LIFETIME_INPUT, '3');
	}

	static async removeApplication(): Promise<any> {
		await Util.clickElementById(this.REMOVE_APPLICATION_BUTTON);
		await Util.waitForPresenceOfElementById(this.REMOVE_APPLICATION_MODAL);
		await Util.clickElementById(this.CONFIRM_REMOVE_APPLICATION_BUTTON);
	}

}
