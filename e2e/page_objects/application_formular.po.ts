import {browser, by, element, protractor, ProtractorExpectedConditions} from 'protractor';
import {Util} from '../util';

/**
 * Page object for the Application requests.
 */
export class FormularPage {
  private static SUBMIT_BTN: string = 'submit_btn';
  private static VERIFICATION_BTN: string = 'verification_btn';
  private static ACKNOWLEDGE_BTN: string = 'acknowledge_approve_btn';
  private static APPLICATION_SUBMITTED: string = 'The application was submitted';
  private static NOTIFICATION_MESSAGE: string = 'notification_message';
  public static NOTIFICATION_BTN_REDIRECT: string = 'notification_btn_redirect';

  static async submitApplication(): Promise<any> {
    console.log('Submit Application');

    await Util.clickElementById(this.SUBMIT_BTN);
    await Util.clickElementById(this.VERIFICATION_BTN);
    await Util.clickElementById(this.ACKNOWLEDGE_BTN);
    console.log('Submitted Application');
  }

  static async navigateToCloudApplication(): Promise<any> {
    await Util.navigateToAngularPage('applications/newCloudApplication');

    return await Util.waitForPage('applications/newCloudApplication');
  }

  static async navigateToSimpleVmApplication(): Promise<any> {
    await Util.navigateToAngularPage('applications/newSimpleVmApplication');
    await Util.waitForPage('applications/newSimpleVmApplication');

  }

  static async isApplicationSubmitted(): Promise<any> {
    return await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.APPLICATION_SUBMITTED);
  }

  static async fillApplicationFormular(name: string): Promise<any> {

    // fill  Formular
    console.log('Fill form');
    await Util.sendTextToElementByName('project_application_name', name);
    await Util.sendTextToElementByName('project_application_shortname', name);
    await Util.sendTextToElementByName('project_application_description', 'ProtractorTest Description');
    await Util.sendTextToElementByName('project_application_lifetime', '4');
    await Util.sendTextToElementByName('project_application_institute', 'Proctractor Institute');
    await Util.sendTextToElementByName('project_application_workgroup', 'Proctractor Workgroup');
    await Util.sendTextToElementByName('project_application_bmbf_project', 'BMBF Project');
    await Util.sendTextToElementByName('project_application_elixir_project', 'Elixir Project');
    await Util.sendTextToElementById('project_application_de.NBI default', '2');
    await Util.sendTextToElementByElement(element(by.className('input-container')).element(by.tagName('input')), 'Bioinformatics');
    await Util.clickElementById('<b>Bioinformatics</b>');
    await Util.sendTextToElementByName('project_application_horizon2020', 'Horizon2020Project');
    await Util.sendTextToElementById('id_project_application_volume_limit', '2');
    await Util.clickElementById('id_project_application_report_allowed');
    await Util.clickElementById('id_project_application_sensitive_data');
    await Util.sendTextToElementByName('information_public_title_input', 'A Public Title');
    await Util.clickElementById('public_description_enabled');
    await Util.sendTextToElementByName('information_description', 'A Public Description');
    await Util.clickElementById('information_resources_checkbox');
    await Util.clickElementById('information_lifetime_checkbox');
    await Util.clickElementById('information_project_type_checkbox');
    await Util.clickElementById('information_pi_name_checkbox');
    await Util.clickElementById('information_institution_checkbox');
    await Util.clickElementById('information_workgroup_checkbox');
    await Util.clickElementById('information_project_affiliation_checkbox');
    await Util.clickElementById('platform_denbi_checkbox');
    await Util.clickElementById('platform_twitter_checkbox');
    await Util.clickElementById('project_application_pi_approved_checkbox');
    await Util.clickElementById('project_application_responsibility_checkbox');
  }
}
