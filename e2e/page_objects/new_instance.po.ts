import {by, element} from 'protractor';
import {Util} from '../util';

/**
 * New Instance Page.
 */
export class NewInstancePage {
  private static NEW_INSTANCE_URL: string = 'virtualmachines/newVM';
  private static PROJECT_SELECT_ID: string = 'projectSelect';
  private static PROJECT_NAME: string = `id_option_${Util.SIMPLE_VM_APPLICATION_NAME}`;
  private static BASIC_VM_NAME: string = Util.BASIC_VM_NAME;
  private static VOLUME_VM_NAME: string = Util.VOLUME_VM_NAME;
  private static ID_INSTANCE_NAME: string = 'id_instance_name';
  private static DEFAULT_FLAVOR_TITLE: string = 'de.NBI default';
  private static UBUNTU_18_TITLE: string = 'Ubuntu 18.04 LTS (2019-08-08)';
  private static START_BUTTON: string = 'startVMButton';
  private static OVERVIEW_BUTTON: string = 'goToOverviewButton';
  private static FLAVOR_ID: string = 'id_flavor_detail';
  private static IMAGE_ID: string = 'id_image_detail';
  private static FLAVOR_PREFIX: string = 'id_flavor_owl_';
  private static IMAGE_PREFIX: string = 'id_image_owl_';
  private static VOLUME_NAME_ID: string = 'volume_name';
  private static VOLUME_SPACE_ID: string = 'volume_space';
  private static VOLUME_SPACE: string = '1';
  private static CLOSE_INFO_MODAL: string = 'close_info_modal';
  private static OPTIONAL_ACCORDION: string = 'optional_accordion';
  private static HOW_TO_CONNECT: string = 'how_to_connect_id';
  private static HTC_VM_NAME: string = 'instance_name';

  static async getNewInstanceTab(): Promise<any> {
    Util.logMethodCall('Navigating to New Instance Tab');
    await Util.navigateToAngularPage(this.NEW_INSTANCE_URL);

    return await Util.waitForPage(this.NEW_INSTANCE_URL);
  }

  static async chooseProject(): Promise<any> {
    await Util.waitForPresenceOfElementById('application_form');
    await Util.waitForPresenceOfElementById(this.PROJECT_SELECT_ID);
    await Util.waitForElementToBeClickableById(this.PROJECT_SELECT_ID);
    console.log('Getting option from select');
    await Util.clickOptionOfSelect(this.PROJECT_NAME, this.PROJECT_SELECT_ID);
  }

  static async fillBasicForm(): Promise<any> {
    Util.logMethodCall('Fill new instance basic form');

    await this.fillMandatoryFormWith(this.BASIC_VM_NAME, this.DEFAULT_FLAVOR_TITLE, this.UBUNTU_18_TITLE);
  }

  static async fillBasicVolumeForm(): Promise<any> {
    Util.logMethodCall('Fill new instance basic volume form');

    await this.fillMandatoryFormWith(this.VOLUME_VM_NAME, this.DEFAULT_FLAVOR_TITLE, this.UBUNTU_18_TITLE);
  }

  static async fillMandatoryFormWith(instance_name: string, flavor: string, image: string): Promise<any> {
    Util.logMethodCall('Fill new instance mandatory form');

    await Util.waitForPresenceOfElementById(this.ID_INSTANCE_NAME);
    await element(by.id(this.ID_INSTANCE_NAME)).sendKeys(instance_name);
    await Util.waitForPresenceOfElementById(this.FLAVOR_ID);
    await element(by.id(this.FLAVOR_ID)).element(by.id(`${this.FLAVOR_PREFIX}${flavor}`)).click();
    await Util.waitForPresenceOfElementById(this.IMAGE_ID);
    await element(by.id(this.IMAGE_ID)).element(by.id(`${this.IMAGE_PREFIX}${image}`)).click();
  }

  static async submitAndStartVM(): Promise<any> {
    Util.logMethodCall('Submit and start VM');

    await Util.waitForElementToBeClickableById(this.START_BUTTON);
    await Util.clickElementById(this.START_BUTTON);
  }

  static async waitForConfirmation(): Promise<boolean> {
    return await Util.waitForPresenceOfElementById(this.OVERVIEW_BUTTON, Util.LONG_TIMEOUT);
  }

  static async setVolume(): Promise<any> {
    Util.logMethodCall('Set Volume');

    await Util.clickElementById(this.OPTIONAL_ACCORDION);
    console.log('Setting Volume name');
    await Util.sendTextToElementById(this.VOLUME_NAME_ID, Util.VOLUME_NAME);
    console.log('Setting Volume space');
    await Util.sendTextToElementById(this.VOLUME_SPACE_ID, this.VOLUME_SPACE);
  }

  static async closeInfoModal(): Promise<any> {
    await Util.clickElementById(this.CLOSE_INFO_MODAL)
  }

  static async getVMName(): Promise<string> {
    await Util.waitForPresenceByElement(element(by.id(this.HOW_TO_CONNECT)));

    return await element(by.id(this.HOW_TO_CONNECT)).element(by.id(this.HTC_VM_NAME)).getText();
  }
}
