import {browser, by, element, ElementFinder} from 'protractor';
import {Util} from '../util';

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

  static async navigateToVolumeOverview(): Promise<any> {
    Util.logMethodCall('Navigating to vo overview');
    await Util.navigateToAngularPage(this.VO_OVERVIEW_URL);
  }

  static async filterForPTProjets(): Promise<any> {
    Util.logMethodCall('Filter for PT Projects');
    await Util.sendTextToElementById(this.FILTER_PROJECT_NAME_INPUT, 'PT');
    await browser.sleep(2000)
  }

  static async getAllPTProjects(): Promise<any> {
    Util.logMethodCall('Get all PT projects');
    const ele: any = element(by.buttonText(this.TERMINATE_BUTTON_TEXT));
    while (await ele.isPresent()) {
      await this.terminateProject(ele);
      await this.navigateToVolumeOverview();
      await this.filterForPTProjets();
      await this.getAllPTProjects();
    }

  }

  static async terminateProject(terminateBtnId: Element): Promise<any> {
    Util.logMethodCall(`Terminate Project ${terminateBtnId}`);

    await Util.clickElementByElement(terminateBtnId);
    await Util.clickElementById(this.TERMINATE_PROJECT_BTN);
    await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.PROJECT_TERMINATED_MESSAGE, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.CLOSE_NOTIFICATION_BTN);
    await browser.sleep(10000)

  }

}
