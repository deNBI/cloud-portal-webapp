import { browser, by, element } from 'protractor';
import { Util } from '../util';

export class NewClusterPage {
	private static NEW_CLUSTER_URL: string = 'virtualmachines/newCluster';
	private static PROJECT_SELECT_ID: string = 'projectSelect';
	private static PROJECT_NAME: string = `id_option_${Util.SIMPLE_VM_APPLICATION_NAME}`;
	private static MASTER_FLAVOR_ID: string = 'master_id_flavor_detail';
	private static MASTER_IMAGE_ID: string = 'master_id_image_detail';
	private static FLAVOR_PREFIX: string = 'id_flavor_owl_';
	private static IMAGE_PREFIX: string = 'id_image_owl_';
	private static SELECTED_BATCH_WORKER_FLAVOR_SELECTION = 'selected_batch_id_flavor_detail';
	private static SELECTED_BATCH_WORKER_COUNT: string = 'workerInstancesCount_1';
	private static START_BUTTON: string = 'startClusterButton';
	private static NEW_CLUSTER_ID_FIELD: string = 'new_cluster_id';
	private static INFO_MODAL: string = 'info_modal';
	private static RESPONSIBILITY_CONFIRMATION: string = 'cluster_responsibility';

	static async navigateToNewClusterPage(): Promise<any> {
		Util.logInfo(`Navigating to: ${this.NEW_CLUSTER_URL}`);
		await Util.navigateToAngularPage(this.NEW_CLUSTER_URL);

		return await Util.waitForPage(this.NEW_CLUSTER_URL);
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

	static async fillBasicForm(): Promise<any> {
		Util.logInfo('Fill new instance basic form');

		await this.fillMandatoryFormWith(Util.DEFAULT_FLAVOR_NAME, Util.UBUNTU_18_TITLE);
	}

	static async fillMandatoryFormWith(flavor: string, image: string, worker_count: string = '2'): Promise<any> {
		Util.logInfo('Fill new cluster mandatory form');

		await Util.waitForPresenceOfElementById(this.MASTER_FLAVOR_ID);
		await element(by.id(this.MASTER_FLAVOR_ID)).element(by.id(`${this.FLAVOR_PREFIX}${flavor}`)).click();
		await Util.waitForPresenceOfElementById(this.MASTER_IMAGE_ID);
		await element(by.id(this.MASTER_IMAGE_ID)).element(by.id(`${this.IMAGE_PREFIX}${image}`)).click();
		await browser.sleep(5000);
		await Util.waitForPresenceOfElementById(this.SELECTED_BATCH_WORKER_FLAVOR_SELECTION);
		await element(by.id(this.SELECTED_BATCH_WORKER_FLAVOR_SELECTION)).element(by.id(`${this.FLAVOR_PREFIX}${flavor}`)).click();
		await Util.waitForPresenceOfElementById(this.SELECTED_BATCH_WORKER_COUNT);
		await Util.sendTextToElementByIdUnsecure(this.SELECTED_BATCH_WORKER_COUNT, worker_count);
		await Util.clickElementById(this.RESPONSIBILITY_CONFIRMATION);
	}

	static async submitAndStartCluster(): Promise<any> {
		Util.logInfo('Submit and start Cluster');

		await Util.waitForElementToBeClickableById(this.START_BUTTON);
		await Util.clickElementById(this.START_BUTTON);

		return await this.getClusterName();
	}

	static async getClusterName(): Promise<string> {
		await Util.waitForPresenceOfElementById(this.INFO_MODAL);
		await Util.waitForPresenceOfElementById(this.NEW_CLUSTER_ID_FIELD);

		return await element(by.id(this.NEW_CLUSTER_ID_FIELD)).getText();
	}
}
