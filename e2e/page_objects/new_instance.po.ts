import ***REMOVED***by, element***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from '../util';

export class NewInstancePage ***REMOVED***
  private static NEW_INSTANCE_URL: string = 'virtualmachines/newVM';
  private static PROJECT_SELECT_ID: string = 'projectSelect';
  private static PROJECT_NAME: string = `id_option_$***REMOVED***Util.SIMPLE_VM_APPLICATION_NAME***REMOVED***`;
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
  private static VOLUME_SPACE: number = 1;
  private static HOW_TO_CONNECT: string = 'howToConnect';
  private static HTC_VM_NAME: string = 'htc_vm_name';
  private static INFO_MODAL: string = 'info_modal';
  private static CLOSE_INFO_MODAL: string = 'close_info_modal';
  private static OPTIONAL_ACCORDION: string = 'optional_accordion';

  static async getNewInstanceTab(): Promise<any> ***REMOVED***
    console.log('Navigating to New Instance Tab');
    await Util.navigateToAngularPage(this.NEW_INSTANCE_URL);

    return await Util.waitForPage(this.NEW_INSTANCE_URL);
  ***REMOVED***

  static async chooseProject(): Promise<any> ***REMOVED***
    await Util.waitForPresenceOfElementById('application_form');
    await Util.waitForPresenceOfElementById(this.PROJECT_SELECT_ID);
    await Util.waitForElementToBeClickableById(this.PROJECT_SELECT_ID);
    console.log('Getting option from select');
    await Util.clickOptionOfSelect(this.PROJECT_NAME, this.PROJECT_SELECT_ID);
  ***REMOVED***

  static async fillBasicForm(): Promise<any> ***REMOVED***
    await this.fillMandatoryFormWith(this.BASIC_VM_NAME, this.DEFAULT_FLAVOR_TITLE, this.UBUNTU_18_TITLE);
  ***REMOVED***

  static async fillBasicVolumeForm(): Promise<any> ***REMOVED***
    await this.fillMandatoryFormWith(this.VOLUME_VM_NAME, this.DEFAULT_FLAVOR_TITLE, this.UBUNTU_18_TITLE);
  ***REMOVED***

  static async fillMandatoryFormWith(instance_name: string, flavor: string, image: string): Promise<any> ***REMOVED***
    await Util.waitForPresenceOfElementById(this.ID_INSTANCE_NAME);
    await element(by.id(this.ID_INSTANCE_NAME)).sendKeys(instance_name);
    await Util.waitForPresenceOfElementById(this.FLAVOR_ID);
    await element(by.id(this.FLAVOR_ID)).element(by.id(`$***REMOVED***this.FLAVOR_PREFIX***REMOVED***$***REMOVED***flavor***REMOVED***`)).click();
    await Util.waitForPresenceOfElementById(this.IMAGE_ID);
    await element(by.id(this.IMAGE_ID)).element(by.id(`$***REMOVED***this.IMAGE_PREFIX***REMOVED***$***REMOVED***image***REMOVED***`)).click();
  ***REMOVED***

  static async submitAndStartVM(): Promise<any> ***REMOVED***
    await Util.waitForElementToBeClickableById(this.START_BUTTON);
    await element(by.id(this.START_BUTTON)).click();
  ***REMOVED***

  static async waitForConfirmation(): Promise<boolean> ***REMOVED***
    return await Util.waitForPresenceOfElementById(this.OVERVIEW_BUTTON, 420000);
  ***REMOVED***

  static async setVolume(): Promise<any> ***REMOVED***
    await element(by.id(this.OPTIONAL_ACCORDION)).click();
    console.log('Setting Volume name');
    await element(by.id(this.VOLUME_NAME_ID)).sendKeys(this.VOLUME_NAME);
    console.log('Setting Volume space');
    await element(by.id(this.VOLUME_SPACE_ID)).sendKeys(this.VOLUME_SPACE);
  ***REMOVED***

  static async getVMName(): Promise<string> ***REMOVED***
    await Util.waitForPresenceByElement(element(by.id(this.HOW_TO_CONNECT)).element(by.id(this.HTC_VM_NAME)));

    return await element(by.id(this.HOW_TO_CONNECT)).element(by.id(this.HTC_VM_NAME)).getText();
  ***REMOVED***

  static async closeInfoModal(): Promise<any> ***REMOVED***
    await element(by.id(this.INFO_MODAL)).element(by.id(this.CLOSE_INFO_MODAL)).click();
  ***REMOVED***
***REMOVED***
