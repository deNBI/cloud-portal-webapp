import {browser, by, element} from 'protractor';
import {Util} from '../util';

export class NewInstancePage {
  private static NEW_INSTANCE_URL: string = 'virtualmachines/newVM';
  private static PROJECT_SELECT_ID: string = 'projectSelect';
  private static PROJECT_NAME: string = 'id_option_ProtractorTest';
  private static BASIC_VM_NAME: string = 'ProtractorVM';
  private static VOLUME_VM_NAME: string = 'ProtractorVMVolume';
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
  private static VOLUME_NAME: string = 'ProtractorVolume';
  private static VOLUME_SPACE_ID: string = 'volume_space';
  private static VOLUME_SPACE: number = 5;
  private static HOW_TO_CONNECT: string = 'howToConnect';
  private static HTC_VM_NAME: string = 'htc_vm_name';
  private static INFO_MODAL: string = 'info_modal';
  private static CLOSE_INFO_MODAL: string = 'close_info_modal';
  private static OPTIONAL_ACCORDION: string = 'optional_accordion';

  static async getNewInstanceTab(): Promise<any> {
    console.log('Navigating to New Instance Tab');
    await Util.navigateToAngularPage(this.NEW_INSTANCE_URL);

    return await Util.waitForPage(this.NEW_INSTANCE_URL);
  }

  static async chooseProject(): Promise<any> {
    await Util.waitForPresenceOfElement('application_form');
    await Util.waitForPresenceOfElement(this.PROJECT_SELECT_ID);
    await Util.getOptionOfSelect(this.PROJECT_NAME, this.PROJECT_SELECT_ID);
  }

  static async fillBasicForm(): Promise<any> {
    await this.fillMandatoryFormWith(this.BASIC_VM_NAME, this.DEFAULT_FLAVOR_TITLE, this.UBUNTU_18_TITLE);
  }

  static async fillBasicVolumeForm(): Promise<any> {
    await this.fillMandatoryFormWith(this.VOLUME_VM_NAME, this.DEFAULT_FLAVOR_TITLE, this.UBUNTU_18_TITLE);
  }

  static async fillMandatoryFormWith(instance_name: string, flavor: string, image: string): Promise<any> {
    await Util.waitForPresenceOfElement(this.ID_INSTANCE_NAME);
    await element(by.id(this.ID_INSTANCE_NAME)).sendKeys(instance_name);
    await Util.waitForPresenceOfElement(this.FLAVOR_ID);
    await element(by.id(this.FLAVOR_ID)).element(by.id(`${this.FLAVOR_PREFIX}${flavor}`)).click();
    await Util.waitForPresenceOfElement(this.IMAGE_ID);
    await element(by.id(this.IMAGE_ID)).element(by.id(`${this.IMAGE_PREFIX}${image}`)).click();
  }

  static async submitAndStartVM(): Promise<any> {
    await Util.waitForElementToBeClickableById(this.START_BUTTON);
    await element(by.id(this.START_BUTTON)).click();
  }

  static async waitForConfirmation(): Promise<boolean> {
    return await Util.waitForPresenceOfElement(this.OVERVIEW_BUTTON, 420000);
  }

  static async setVolume(): Promise<any> {
    await element(by.id(this.OPTIONAL_ACCORDION)).click();
    console.log('Setting Volume name');
    await element(by.id(this.VOLUME_NAME_ID)).sendKeys(this.VOLUME_NAME);
    console.log('Setting Volume space');
    await element(by.id(this.VOLUME_SPACE_ID)).sendKeys(this.VOLUME_SPACE);
  }

  static async getVMName(): Promise<string> {
    await Util.waitForPresenceByElement(element(by.id(this.HOW_TO_CONNECT)).element(by.id(this.HTC_VM_NAME)));

    return await element(by.id(this.HOW_TO_CONNECT)).element(by.id(this.HTC_VM_NAME)).getText();
  }

  static async closeInfoModal(): Promise<any> {
    await element(by.id(this.INFO_MODAL)).element(by.id(this.CLOSE_INFO_MODAL)).click();
  }
}
