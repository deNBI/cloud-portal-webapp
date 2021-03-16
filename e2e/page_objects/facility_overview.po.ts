import {Util} from '../util';
import {by, element} from 'protractor';

/**
 * Facilityoverivew page.
 */
export class FacilityOverviewPage {

  private static FACILITY_OVERVIEW_URL: string = 'facility-manager/facilityApplications';
  private static APPLICATION_APPROVAL_BTN_PREFIX: string = 'approval_';
  private static SUCCESSFULLY_APPROVED_APPL: string = 'Successfully approved the application.';
  private static NOTIFICATION_MESSAGE: string = 'notification_message';
  private static EXTENSION_APPROVAL_BTN_PREFIX: string = 'extension_approval_';
  private static MODIFICATION_APPROVAL_BTN_PREFIX: string = 'approveModificationButton_';
  private static EXTENSION_SUCCESSFULLY: string = 'Successfully approved the application modification.';
  private static MODIFICATION_EXTENSION_SUCCESS_TEXT: string = 'Successfully approved modification!';
  private static TAB_STATE_MODIFICATION_BUTTON: string = 'tab_state_button_modification_requests';
  private static TAB_STATE_TERMINATION_BUTTON: string = 'tab_state_button_termination_requests';
  private static TERMINATE_PT_APPLICATION_BTN: string = 'approveTerminationButton_PTOpenStack'
  private static TERMINATE_PROJECT_BTN: string = 'terminate_project_btn';
  private static WAS_TERMINATED: string = 'The project was terminated.'
  private static CLOSE_NOTIFICATION_BTN: string = 'close_notification';
  private static LOADING_APPLICATIONS: string = 'loading_applications';
  private static TERMINATION_TABLE: string = 'termination_table';

  static async navigateToFacilityOverview(): Promise<any> {
    Util.logInfo('Navigating to facility overview');
    await Util.navigateToAngularPage(this.FACILITY_OVERVIEW_URL);
  }

  static async approveApplication(application_name: string): Promise<any> {
    await Util.clickElementById(this.APPLICATION_APPROVAL_BTN_PREFIX + application_name);
    await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.SUCCESSFULLY_APPROVED_APPL);
  }

  static async approveApplicationExtension(application_name: string): Promise<any> {
    await Util.clickElementById(this.EXTENSION_APPROVAL_BTN_PREFIX + application_name);
    await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.EXTENSION_SUCCESSFULLY);
  }

  static async terminatePTApplications(): Promise<any> {
    await Util.waitForPresenceOfElementById(this.TAB_STATE_TERMINATION_BUTTON, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.TAB_STATE_TERMINATION_BUTTON);
    await Util.waitForAbsenceOfElementById(this.LOADING_APPLICATIONS, Util.LONG_TIMEOUT)
    await Util.waitForPresenceOfElementById(this.TERMINATION_TABLE, Util.LONG_TIMEOUT);

    Util.logInfo('Terminate all PT projects');
    let ele: any = element(by.id(this.TERMINATE_PT_APPLICATION_BTN));
    while (await ele.isPresent()) {
      await this.terminateProject(ele);
      ele = element(by.id(this.TERMINATE_PT_APPLICATION_BTN));
    }
  }

  static async terminateProject(terminateBtnId: Element): Promise<any> {
    Util.logInfo(`Terminate Project ${terminateBtnId}`);

    await Util.clickElementByElement(terminateBtnId);
    await Util.clickElementById(this.TERMINATE_PROJECT_BTN);
    await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.WAS_TERMINATED, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.CLOSE_NOTIFICATION_BTN);

  }

  static async approveApplicationModification(application_name: string): Promise<any> {
    await Util.waitForPresenceOfElementById(this.TAB_STATE_MODIFICATION_BUTTON, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.TAB_STATE_MODIFICATION_BUTTON);
    await Util.waitForAbsenceOfElementById(this.LOADING_APPLICATIONS, Util.LONG_TIMEOUT)
    await Util.waitForPresenceOfElementById(this.MODIFICATION_APPROVAL_BTN_PREFIX + application_name, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.MODIFICATION_APPROVAL_BTN_PREFIX + application_name);
    await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.MODIFICATION_EXTENSION_SUCCESS_TEXT, Util.LONG_TIMEOUT);
  }

}
