import {browser, by, element} from 'protractor';
import {Util} from '../util';

/**
 *  FM Overview Page.
 */
export class FmProjectsOverview {

  private static FM_OVERVIEW_URL: string = 'facility-manager/facilityProjects';
  private static FILTER_PROJECT_NAME_INPUT: string = 'filter_project_name';
  private static SHOW_TERMINATE_PREFIX: string = 'show_terminate_';
  private static TERMINATE_PROJECT_BTN: string = 'terminate_project_btn';
  private static NOTIFICATION_MESSAGE: string = 'notification_message';
  private static CLOSE_NOTIFICATION_BTN: string = 'close_notification';
  private static PROJECT_TERMINATED_MESSAGE: string = 'The project was terminated.';
  private static TERMINATE_BUTTON_TEXT: string = 'Terminate Project';
  private static NOTIFICATION_MODAL_TITLE: string = 'notification_modal_title'
  private static SUCCESS: string = 'Success'

  static async navigateToFMProjectsOverview(): Promise<any> {
    Util.logInfo('Navigating to fm projects overview');
    await Util.navigateToAngularPage(this.FM_OVERVIEW_URL);
  }

  static async filterForPTProjets(): Promise<any> {
    Util.logInfo('Filter for PT Projects');
    await Util.sendTextToElementByIdUnsecure(this.FILTER_PROJECT_NAME_INPUT, 'PT');
    await browser.sleep(2000)
  }

  static async terminateAllPTProjects(): Promise<any> {
    Util.logInfo('Terminate all PT projects');
    let ele: any = element(by.buttonText(this.TERMINATE_BUTTON_TEXT));
    while (await ele.isPresent()) {
      await this.terminateProject(ele);
      ele = element(by.buttonText(this.TERMINATE_BUTTON_TEXT));
    }

  }

  static async terminateProject(terminateBtnId: Element): Promise<any> {
    Util.logInfo(`Terminate Project ${terminateBtnId}`);

    await Util.clickElementByElement(terminateBtnId);
    await Util.clickElementById(this.TERMINATE_PROJECT_BTN);
    await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MODAL_TITLE, this.SUCCESS);
    await Util.clickElementById(this.CLOSE_NOTIFICATION_BTN);
    await browser.sleep(5000)

  }

}
