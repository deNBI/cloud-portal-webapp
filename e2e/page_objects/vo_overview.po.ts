import {
	browser, by, element, ElementFinder,
} from 'protractor';
import { Util } from '../util';

/**
 *  Vo Overview Page.
 */
export class VoOverviewPage {

	private static VO_OVERVIEW_URL: string = 'vo-manager/overview';
	private static FILTER_PROJECT_NAME_INPUT: string = 'filter_project_name';
	private static SHOW_TERMINATE_PREFIX: string = 'show_terminate_';
	private static TERMINATE_PROJECT_BTN: string = 'terminate_project_btn';
	private static NOTIFICATION_MESSAGE: string = 'notification_message';
	private static CLOSE_NOTIFICATION_BTN: string = 'close_notification';
	private static PROJECT_TERMINATED_MESSAGE: string = 'The project was terminated.';
	private static TERMINATE_BUTTON_TEXT: string = 'Terminate Project';
	private static NOTIFICATION_MODAL_TITLE: string = 'notification_modal_title'
	private static SUCCESS: string = 'Success'

	static async navigateToVolumeOverview(): Promise<any> {
		Util.logInfo('Navigating to vo overview');
		await Util.navigateToAngularPage(this.VO_OVERVIEW_URL);
	}

	static async filterForPTProjets(): Promise<any> {
		Util.logInfo('Filter for PT Projects');
		await Util.sendTextToElementByIdUnsecure(this.FILTER_PROJECT_NAME_INPUT, 'PT');
		await browser.sleep(2000);
	}

	static async terminateAllPTProjects(): Promise<any> {
		Util.logInfo('Terminate all PT projects');
		const elements: any = await Util.getElementsByIdPrefix(this.SHOW_TERMINATE_PREFIX);
		for (const ele of elements) {
			// eslint-disable-next-line no-await-in-loop
			await this.terminateProject(ele);
		}
	}

	static async terminateProject(terminateBtnId: Element): Promise<any> {
		Util.logInfo(`Terminate Project ${terminateBtnId}`);

		await Util.clickElementByElement(terminateBtnId);
		await Util.clickElementById(this.TERMINATE_PROJECT_BTN);
		await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MODAL_TITLE, this.SUCCESS);
		await Util.clickElementById(this.CLOSE_NOTIFICATION_BTN);

	}

}
