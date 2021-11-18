import { by, element, ElementFinder } from 'protractor';
import { Util } from '../util';

/**
 * Applicationoverview page object.
 */
export class ApplicationOverviewPage {
	private static OWN_APPLICATION_ID: string = 'own_applications';
	private static EXTENSION_RESULT: string = 'notification_message';
	private static EXTENSION_SV_SUCCESSFULLY_APPROVED: string = 'Modify request successfully approved!';
	private static EXTENSION_OP_SUCCESFULLY_APPROVED: string = 'Modify request successfully approved and forwarded to facility!';
	private static EXTENSION_APPROVAL_BTN_PREFIX: string = 'extension_approval_';
	private static COMPUTE_CENTER_SELECTION_PREFIX: string = 'id_compute_center_option_';
	private static DEFAULT_DENBI_COMPUTE_CENTER: string = 'de.NBI Cloud Portal - Development';
	private static CLOUD_PROJECT_CREATED: string = 'The new project was created';
	private static SIMPLE_VM_CREATED: string = 'The project was created!';
	private static NOTIFICATION_MESSAGE: string = 'notification_modal_message';
	private static APPROVAL_PREFIX: string = 'approve_';
	private static APPROVAL_CLIENT_LIMIT_PREFIX: string = 'approve_client_limit_';
	private static MODIFICATION_TAB_BUTTON: string = 'tab_state_button_modification_request';
	private static MODIFICATION_APPROVAL_BTN_PREFIX: string = 'modification_approval_';
	private static MODIFICATION_REQUEST_RESULT_TEXT: string = 'The resource modification request was approved!';
	private static EXTENSION_TAB_BUTTON: string = 'tab_state_button_extension_request';
	private static EXTENSION_RESULT_MESSAGE_TEXT: string = 'The project has been extended!';
	private static DECLINE_PT_OPEN_APPLICATION_PRE: string = 'btn_decline_PTOpenStack'
	private static DECLINE_PT_SIMPLE_APPLICATION_PRE: string = 'btn_decline_PTSimpleVM'
	private static SUCCESSFULL_DECLINED: string = 'The Application was declined'
	private static CLOSE_NOTIFICATION_MODAL: string = 'close_notification_modal_btn'
	private static SUBMITTED_APPLICATIONS_TAB: string = 'tab_state_button_submitted_applications'
	private static LOADING_APPLICATIONS: string = 'loading_applications';

	static async navigateToApplicationOverview(): Promise<any> {
		Util.logInfo('Navigate to Application Overview form');
		await Util.navigateToAngularPage('applications');
		await Util.waitForPage('applications');
	}

	static async declinePTApplications(): Promise<any> {
		Util.logInfo('Decline all PT applications');
		await Util.waitForPresenceOfElementById(this.SUBMITTED_APPLICATIONS_TAB);
		Util.logInfo('Decline open PT OpenStack applications');

		let openstack_ele: ElementFinder = element(by.id(this.DECLINE_PT_OPEN_APPLICATION_PRE));

		while (await openstack_ele.isPresent()) {
			await Util.clickElementByElement(openstack_ele);
			await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.SUCCESSFULL_DECLINED);
			await Util.clickElementById(this.CLOSE_NOTIFICATION_MODAL);
			openstack_ele = element(by.id(this.DECLINE_PT_OPEN_APPLICATION_PRE));

		}
		Util.logInfo('Decline open PT SimpleVM applications');

		let simple_ele: ElementFinder = element(by.id(this.DECLINE_PT_SIMPLE_APPLICATION_PRE));
		while (await simple_ele.isPresent()) {
			await Util.clickElementByElement(simple_ele);
			await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.SUCCESSFULL_DECLINED);
			await Util.clickElementById(this.CLOSE_NOTIFICATION_MODAL);
			simple_ele = element(by.id(this.DECLINE_PT_SIMPLE_APPLICATION_PRE));

		}

	}

	static async approveModificationRequest(application_name: string): Promise<any> {
		await Util.waitForPresenceOfElementById(this.MODIFICATION_TAB_BUTTON);
		await Util.clickElementById(this.MODIFICATION_TAB_BUTTON);
		await Util.waitForAbsenceOfElementById(this.LOADING_APPLICATIONS);

		await Util.waitForPresenceOfElementById(this.MODIFICATION_APPROVAL_BTN_PREFIX + application_name);
		await Util.clickElementById(this.MODIFICATION_APPROVAL_BTN_PREFIX + application_name);
		await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.MODIFICATION_REQUEST_RESULT_TEXT);

	}

	static async approveSimpleVMModificationRequest(application_name: string): Promise<any> {
		await Util.waitForPresenceOfElementById(this.MODIFICATION_TAB_BUTTON);
		await Util.clickElementById(this.MODIFICATION_TAB_BUTTON);
		await Util.waitForAbsenceOfElementById(this.LOADING_APPLICATIONS);

		await Util.waitForPresenceOfElementById(this.MODIFICATION_APPROVAL_BTN_PREFIX + application_name);
		await Util.clickElementById(this.MODIFICATION_APPROVAL_BTN_PREFIX + application_name);
		await Util.clickElementById(this.APPROVAL_CLIENT_LIMIT_PREFIX + application_name);

		await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.MODIFICATION_REQUEST_RESULT_TEXT);

	}

	static async approveExtensionRequest(application_name: string): Promise<any> {

		await Util.waitForPresenceOfElementById(this.EXTENSION_TAB_BUTTON);
		await Util.clickElementById(this.EXTENSION_TAB_BUTTON);
		await Util.waitForAbsenceOfElementById(this.LOADING_APPLICATIONS);

		await Util.waitForPresenceOfElementById(this.EXTENSION_APPROVAL_BTN_PREFIX + application_name);
		await Util.clickElementById(this.EXTENSION_APPROVAL_BTN_PREFIX + application_name);
		await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.EXTENSION_RESULT_MESSAGE_TEXT);

	}

	static async isApplicationRequestPresent(application_name: string): Promise<boolean> {
		await Util.waitForPage('applications');
		await Util.waitForPresenceOfElementById(this.OWN_APPLICATION_ID);
		const elm: any = element(by.id(application_name));

		return await elm.isPresent();
	}

	static async approveSimpleVm(application_name: string): Promise<any> {
		await Util.waitForPage('applications');
		await Util.waitForAbsenceOfElementById(this.LOADING_APPLICATIONS);
		await Util.waitForPresenceOfElementById(this.COMPUTE_CENTER_SELECTION_PREFIX + application_name);
		await Util.clickOptionOfSelect(this.DEFAULT_DENBI_COMPUTE_CENTER, this.COMPUTE_CENTER_SELECTION_PREFIX + application_name);
		await Util.clickElementById(this.APPROVAL_PREFIX + application_name);
		await Util.clickElementById(this.APPROVAL_CLIENT_LIMIT_PREFIX + application_name);

		return Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.SIMPLE_VM_CREATED, 60000);

	}

	static async approveCloudApplication(application_name: string): Promise<any> {
		await Util.waitForPage('applications');
		await Util.waitForAbsenceOfElementById(this.LOADING_APPLICATIONS);
		await Util.waitForPresenceOfElementById(this.COMPUTE_CENTER_SELECTION_PREFIX + application_name);
		await Util.clickOptionOfSelect(this.DEFAULT_DENBI_COMPUTE_CENTER, this.COMPUTE_CENTER_SELECTION_PREFIX + application_name);
		await Util.clickElementById(this.APPROVAL_PREFIX + application_name);

		return await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.CLOUD_PROJECT_CREATED);
	}
}
