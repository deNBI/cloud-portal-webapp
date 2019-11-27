import {by, element, browser} from 'protractor';
import {Util} from '../util';

/**
 * Applicationoverview page object.
 */
export class ApplicationOverviewPage {
  private static OWN_APPLICATION_ID: string = 'own_applications';
  private static EXTENSION_RESULT: string = 'extension result';
  private static EXTENSION_SV_SUCCESSFULLY_APPROVED: string = 'Modify request successfully approved!';
  private static EXTENSION_OP_SUCCESFULLY_APPROVED: string = 'Modify request successfully approved and forwarded to facility!';
  private static EXTENSION_APPROVAL_BTN_PREFIX: string = 'extension_approval_';
  private static COMPUTE_CENTER_SELECTION_PREFIX: string = 'id_compute_center_option_';
  private static DEFAULT_DENBI_COMPUTE_CENTER: string = 'de.NBI Cloud Portal - Development';
  private static CLOUD_PROJECT_CREATED: string = 'The new project was created';
  private static SIMPLE_VM_CREATED: string = 'The new project was created and assigned to de.NBI Cloud Portal - Development.';
  private static NOTIFICATION_MESSAGE: string = 'notification_message';
  private static APPROVAL_PREFIX: string = 'approve_';

  static async navigateToApplicationOverview(): Promise<any> {
    console.log('Navigate to Application Overview form');
    await Util.navigateToAngularPage('applications');
    await Util.waitForPage('applications');
  }

  static async approveOPModificationRequest(application_name: string): Promise<any> {
    await Util.clickElementById(this.EXTENSION_APPROVAL_BTN_PREFIX + application_name);
    await Util.waitForTextPresenceInElementById(this.EXTENSION_RESULT, this.EXTENSION_OP_SUCCESFULLY_APPROVED);

  }

  static async approveSVModificationRequest(application_name: string): Promise<any> {
    await Util.clickElementById(this.EXTENSION_APPROVAL_BTN_PREFIX + application_name);
    await Util.waitForTextPresenceInElementById(this.EXTENSION_RESULT, this.EXTENSION_SV_SUCCESSFULLY_APPROVED);

  }

  static async isApplicationRequestPresent(application_name: string): Promise<boolean> {
    await Util.waitForPage('applications');
    await Util.waitForPresenceOfElementById(this.OWN_APPLICATION_ID);
    const elm: any = element(by.id(application_name));

    return await elm.isPresent()
  }

  static async approveSimpleVm(application_name: string): Promise<any> {
    await Util.waitForPage('applications');
    await Util.clickElementById(this.APPROVAL_PREFIX + application_name);

    return await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.SIMPLE_VM_CREATED, 60000);

  }

  static async approveCloudApplication(application_name: string): Promise<any> {
    await Util.waitForPage('applications');
    await Util.waitForPresenceOfElementById(this.COMPUTE_CENTER_SELECTION_PREFIX + application_name);
    await Util.clickOptionOfSelect(this.DEFAULT_DENBI_COMPUTE_CENTER, this.COMPUTE_CENTER_SELECTION_PREFIX + application_name);
    await Util.clickElementById(this.APPROVAL_PREFIX + application_name);

    return await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.CLOUD_PROJECT_CREATED);
  }
}
