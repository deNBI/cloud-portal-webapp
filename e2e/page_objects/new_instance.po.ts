import { browser, by, element } from 'protractor';
import { Util } from '../util';

/**
 * New Instance Page.
 */
export class NewInstancePage {
	private static NEW_INSTANCE_URL: string = 'virtualmachines/newVM';
	private static PROJECT_SELECT_ID: string = 'projectSelect';
	private static PROJECT_NAME: string = `id_option_${Util.SIMPLE_VM_APPLICATION_NAME}`;
	private static BASIC_VM_NAME: string = Util.BASIC_VM_NAME;
	private static REDIRECT_MODAL: string = 'redirect_modal';
	private static NEW_INSTANCE_NAME_SPAN: string = 'new_vm_name';
	private static VOLUME_VM_NAME: string = Util.VOLUME_VM_NAME;
	private static ID_INSTANCE_NAME: string = 'id_instance_name';
	private static START_BUTTON: string = 'startVMButton';
	private static OVERVIEW_BUTTON: string = 'goToOverviewButton';
	private static FLAVOR_ID: string = 'id_flavor_detail';
	private static IMAGE_ID: string = 'id_image_detail';
	private static FLAVOR_PREFIX: string = 'id_flavor_owl_';
	private static IMAGE_PREFIX: string = 'id_image_owl_';
	private static VOLUME_NAME_ID: string = 'volume_name';
	private static VOLUME_MOUNT_PATH_ID: string = 'volume_mount_path';
	private static VOLUME_SPACE_ID: string = 'volume_space';
	private static VOLUME_SPACE: string = '1';
	private static CLOSE_INFO_MODAL: string = 'close_info_modal';
	private static OPTIONAL_ACCORDION: string = 'optional_accordion';
	private static HOW_TO_CONNECT: string = 'how_to_connect_id';
	private static HTC_VM_NAME: string = 'instance_name';
	private static VM_RESPONSIBILITY: string = 'vm_responsibility';
	private static ADD_VOLUME_FORM_BUTTON: string = 'openAddVolumeFormButton';
	private static ADD_VOLUME_CONFIRMATION_BUTTON: string = 'addVolumeConfirmationButton';

	static async getNewInstanceTab(): Promise<any> {
		Util.logInfo('Navigating to New Instance Tab');
		await Util.navigateToAngularPage(this.NEW_INSTANCE_URL);

		return await Util.waitForPage(this.NEW_INSTANCE_URL);
	}

	static async chooseProject(): Promise<any> {
		await Util.waitForPresenceOfElementById('application_form');
		await browser.sleep(15000);
		if (await Util.isElementPresentById('singleProjectNameSpan')) {
			Util.logInfo('Single Project automatically selected');
		} else {
			await Util.waitForPresenceOfElementById(this.PROJECT_SELECT_ID);
			await Util.waitForElementToBeClickableById(this.PROJECT_SELECT_ID);
			Util.logInfo('Getting option from select');
			await Util.clickOptionOfSelect(this.PROJECT_NAME, this.PROJECT_SELECT_ID);
		}
	}

	static async fillBasicForm(name: string = this.BASIC_VM_NAME): Promise<any> {
		Util.logInfo('Fill new instance basic form');

		await this.fillMandatoryFormWith(name, Util.DEFAULT_FLAVOR_NAME, Util.UBUNTU_18_TITLE);
	}

	static async fillBasicVolumeForm(): Promise<any> {
		Util.logInfo('Fill new instance basic volume form');

		await this.fillMandatoryFormWith(this.VOLUME_VM_NAME, Util.DEFAULT_FLAVOR_NAME, Util.UBUNTU_18_TITLE);
	}

	static async fillMandatoryFormWith(instance_name: string, flavor: string, image: string): Promise<any> {
		Util.logInfo('Fill new instance mandatory form');

		await Util.waitForPresenceOfElementById(this.ID_INSTANCE_NAME);
		await Util.sendTextToElementByIdUnsecure(this.ID_INSTANCE_NAME, instance_name);
		await Util.waitForPresenceOfElementById(this.FLAVOR_ID);
		await element(by.id(this.FLAVOR_ID)).element(by.id(`${this.FLAVOR_PREFIX}${flavor}`)).click();
		await Util.waitForPresenceOfElementById(this.IMAGE_ID);
		await element(by.id(this.IMAGE_ID)).element(by.id(`${this.IMAGE_PREFIX}${image}`)).click();
		await Util.clickElementById(this.VM_RESPONSIBILITY);
	}

	static async submitAndStartVM(): Promise<any> {
		Util.logInfo('Submit and start VM');

		await Util.waitForElementToBeClickableById(this.START_BUTTON);
		await Util.clickElementById(this.START_BUTTON);
		// await Util.waitForPage('/virtualmachines/vmOverview')
	}

	static async waitForConfirmation(): Promise<boolean> {
		return await Util.waitForPresenceOfElementById(this.OVERVIEW_BUTTON);
	}

	static async isRedirectModalPresent(): Promise<boolean> {
		return await Util.waitForPresenceOfElementById(this.REDIRECT_MODAL);
	}

	static async setVolume(): Promise<any> {
		Util.logInfo('Set Volume');

		await Util.clickElementById(this.ADD_VOLUME_FORM_BUTTON);
		Util.logInfo('Setting Volume name');
		await Util.sendTextToElementByIdUnsecure(this.VOLUME_NAME_ID, Util.VOLUME_NAME);
		Util.logInfo('Setting Volume mount path');
		await Util.sendTextToElementByIdUnsecure(this.VOLUME_MOUNT_PATH_ID, Util.VOLUME_MOUNT_PATH_STRING);

		Util.logInfo('Setting Volume space');
		await Util.sendTextToElementByIdUnsecure(this.VOLUME_SPACE_ID, this.VOLUME_SPACE);
		await Util.clickElementById(this.ADD_VOLUME_CONFIRMATION_BUTTON);
	}

	static async closeInfoModal(): Promise<any> {
		await Util.clickElementById(this.CLOSE_INFO_MODAL);
	}

	static async getVMName(): Promise<string> {
		await Util.waitForPresenceOfElementById(this.REDIRECT_MODAL);
		await Util.waitForPresenceOfElementById(this.NEW_INSTANCE_NAME_SPAN);

		return await element(by.id(this.NEW_INSTANCE_NAME_SPAN)).getAttribute('textContent');
	}

}
