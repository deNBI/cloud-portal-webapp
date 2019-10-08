import {Util} from '../util';
import {browser, by, element, protractor} from 'protractor';

export class ProjectOverview {

  private static ADD_MEMBER_BTN_MODAL: string = 'add_member_btn_modal';
  private static SEARCH_MEMBER: string = 'add_member_input';
  private static DEFAULT_MEMBER: string = 'Test User';
  private static ADD_MEMBER_BTN: string = 'add_member_btn';
  private static SEARCH_MEMBER_BTN: string = 'search_member_btn';
  private static SUCCESS: string = 'Success';
  private static REMOVE_MEMBER_PREFIX: string = 'remove_member_';
  private static NOTIFICATION_TITLE: string = 'notification_title';
  private static NOTIFICATION_CLOSE: string = 'close_notification';
  private static SUBMIT_MODEL_BTN: string = 'submit_modal_btn';
  private static SUBMIT_RENEWAL_BTN: string = 'submit_renewal_btn';
  private static EXTENSION_RESULT: string = 'extension result';
  private static EXTENSION_SUCCESSFULLY_SUBMITTED: string = 'Modify request successfully submitted!';
  private static EXTENSION_REQUEST_BTN: string = 'show_extension_modal';

  static async navigateToSimpleProjectverview(): Promise<any> {
    console.log('Navigating to simple project overview');
    await Util.clickElementById(Util.SIMPLE_VM_APPLICATION_NAME)
  }

  static async navigateToOpenStackeProjectverview(): Promise<any> {
    console.log('Navigating to openstack project overview');
    await Util.clickElementById(Util.OPENSTACK_APPLICATION_NAME)
  }

  static async addMemberToProject(application_name: string, member: string = this.DEFAULT_MEMBER): Promise<any> {
    console.log('Open add member modal');
    await Util.clickElementById(this.ADD_MEMBER_BTN_MODAL);
    await Util.sendTextToElementById(this.SEARCH_MEMBER, member);
    await Util.clickElementById(this.SEARCH_MEMBER_BTN);
    await Util.clickElementById(this.ADD_MEMBER_BTN);
    await Util.waitForTextPresenceInElementById(this.NOTIFICATION_TITLE, this.SUCCESS);
    console.log('Close Modal');
    await Util.clickElementById(this.NOTIFICATION_CLOSE);
    browser.sleep(1000);

  }

  static async removeMemberFromProject(application_name: string, member: string = this.DEFAULT_MEMBER): Promise<any> {
    await Util.clickElementById(this.REMOVE_MEMBER_PREFIX + member);
    await Util.waitForTextPresenceInElementById(this.NOTIFICATION_TITLE, this.SUCCESS);
    console.log('Close Modal');

    await Util.clickElementById(this.NOTIFICATION_CLOSE);
    browser.sleep(1000);

  }

  static async sendModificationRequest(application_name: string): Promise<any> {
    await Util.clickElementById(this.EXTENSION_REQUEST_BTN);
    await Util.waitForVisibilityOfElementById('id_project_application_renewal_lifetime');
    await this.fillModificationRequest();
    await Util.clickElementById(this.SUBMIT_RENEWAL_BTN);
    await Util.clickElementById(this.SUBMIT_MODEL_BTN);
    await Util.waitForTextPresenceInElementById(this.EXTENSION_RESULT, this.EXTENSION_SUCCESSFULLY_SUBMITTED);
  }

  static async fillModificationRequest(): Promise<any> {
    await Util.sendTextToElementById('id_project_application_renewal_lifetime', '1');
    await Util.sendTextToElementById('id_project_application_renewal_de.NBI default', '2');
    await Util.sendTextToElementById('id_project_application_renewal_volume_counter', '1');
    await Util.sendTextToElementById('id_project_application_renewal_volume_limit', '1');
    await Util.sendTextToElementById('id_project_application_renewal_comment', 'This is a Protrector test modificatioN!');
  }

}
