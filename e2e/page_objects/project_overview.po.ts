import {Util} from '../util';
import {browser, by, element, protractor} from 'protractor';

/**
 * Project Overview page.
 */
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
  private static DENBI_DEFAULT_OLD_ID: string = 'project_application_de.NBI default_old';
  private static DENBI_DEFAULT_NEW_INPUT: string = 'id_project_application_renewal_de.NBI default';
  private static OLD_VOLUME_COUNTER_ID: string = 'project_application_volume_counter';
  private static NEW_VOLUME_COUNTER_ID: string = 'id_project_application_renewal_volume_counter';
  private static OLD_VOLUME_LIMIT_ID: string = 'project_application_volume_limit';
  private static NEW_VOLUME_LIMIT_ID: string = 'id_project_application_renewal_volume_limit';
  private static OLD_OBJECT_STORAGE_ID: string = 'project_application_object_storage';
  private static NEW_OBJECT_STORAGE_ID: string = 'id_project_application_renewal_object_storage';
  private static TOTAL_RAM: string = 'total_ram';
  private static TOTAL_CORES: string = 'total_cores';
  private static BIOINFORMATICS_TOPIC: string = 'topic_Bioinformatics';
  private static SHOW_INFORMATION_BTN: string = 'show_information_btn';
  private static DISSEMINATION_PLATFORM_LIST: string = 'dissemination_platforms';
  private static DISSEMINATION_INFORMATION_LIST: string = 'dissemination_information';
  private static DEFAULT_INFORMATION_DISSEMINATION_STRING: string = 'Project affiliation,Workgroup,Project Type,Title,Resources,Lifetime,PI Name';
  private static DEFAULT_PLATFORM_DISSEMINATION_STRING: string = 'de.NBI Platforms ,Twitter';

  static async navigateToSimpleProjectverview(): Promise<any> {
    console.log('Navigating to simple project overview');
    await Util.clickElementById(Util.SIMPLE_VM_APPLICATION_NAME)
  }

  static async navigateToOpenStackeProjectverview(): Promise<any> {
    console.log('Navigating to openstack project overview');
    await Util.clickElementById(Util.OPENSTACK_APPLICATION_NAME)
  }

  static async isDisseminationSet(): Promise<any> {
    Util.logMethodCall('Check if dissemination is set');
    await Util.waitForTextPresenceInElementById(this.DISSEMINATION_INFORMATION_LIST, this.DEFAULT_INFORMATION_DISSEMINATION_STRING);
    await Util.waitForTextPresenceInElementById(this.DISSEMINATION_PLATFORM_LIST, this.DEFAULT_PLATFORM_DISSEMINATION_STRING);
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
    await browser.sleep(1000);

  }

  static async removeMemberFromProject(application_name: string, member: string = this.DEFAULT_MEMBER): Promise<any> {
    await Util.clickElementById(this.REMOVE_MEMBER_PREFIX + member);
    await Util.waitForTextPresenceInElementById(this.NOTIFICATION_TITLE, this.SUCCESS);
    console.log('Close Modal');

    await Util.clickElementById(this.NOTIFICATION_CLOSE);
    await browser.sleep(1000);

  }

  static async openModificationModal(appication_name: string): Promise<any> {
    await Util.clickElementById(this.EXTENSION_REQUEST_BTN);
    await Util.waitForVisibilityOfElementById('id_project_application_renewal_lifetime');
  }

  static async sendModificationRequest(application_name: string): Promise<any> {
    await Util.clickElementById(this.SUBMIT_RENEWAL_BTN);
    await Util.clickElementById(this.SUBMIT_MODEL_BTN);
    await Util.waitForTextPresenceInElementById(this.EXTENSION_RESULT, this.EXTENSION_SUCCESSFULLY_SUBMITTED);
  }

  static async isBioinformaticsSet(): Promise<any> {
    await Util.clickElementById(this.SHOW_INFORMATION_BTN);
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
    Util.logMethodCall('Check cores and ram');
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
    await Util.sendTextToElementById('id_project_application_renewal_lifetime', '1');
    await Util.sendTextToElementById(this.DENBI_DEFAULT_NEW_INPUT, '2');
    await Util.sendTextToElementById(this.NEW_VOLUME_COUNTER_ID, '1');
    await Util.sendTextToElementById(this.NEW_VOLUME_LIMIT_ID, '1');
    await Util.sendTextToElementById('id_project_application_renewal_comment', 'This is a Protrector test modificatioN!');
  }

}
