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
  private static REDIRECT_MODAL: string = 'redirect_modal';
  private static NEW_INSTANCE_NAME_SPAN: string = 'new_vm_name';
  private static VOLUME_VM_NAME: string = Util.VOLUME_VM_NAME;
  private static ID_INSTANCE_NAME: string = 'id_instance_name';
  private static DEFAULT_FLAVOR_TITLE: string = 'de.NBI default';
  private static UBUNTU_18_TITLE: string = 'Ubuntu 18.04 LTS (2020-05-10)';
  private static START_BUTTON: string = 'startVMButton';
  private static OVERVIEW_BUTTON: string = 'goToOverviewButton';
  private static FLAVOR_ID: string = 'id_flavor_detail';
  private static IMAGE_ID: string = 'id_image_detail';
  private static FLAVOR_PREFIX: string = 'id_flavor_owl_';
  private static IMAGE_PREFIX: string = 'id_image_owl_';
  private static VOLUME_NAME_ID: string = 'volume_name';
  private static VOLUME_MOUNT_PATH_ID: string = 'volume_mount_path';
  private static VOLUME_SPACE_ID: string = 'volume_space';
  private static VOLUME_SPACE: string = '1';
  private static CLOSE_INFO_MODAL: string = 'close_info_modal';
  private static OPTIONAL_ACCORDION: string = 'optional_accordion';
  private static HOW_TO_CONNECT: string = 'how_to_connect_id';
  private static HTC_VM_NAME: string = 'instance_name';
  private static ADD_VOLUME_FORM_BUTTON: string = 'openAddVolumeFormButton';
  private static ADD_VOLUME_CONFIRMATION_BUTTON: string = 'addVolumeConfirmationButton';

  /**
   * Navigates to the new instance site.
   */
  static async getNewInstanceTab(): Promise<any> {
    Util.logMethodCall('Navigating to New Instance Tab');
    await Util.navigateToAngularPage(this.NEW_INSTANCE_URL);

    return await Util.waitForPage(this.NEW_INSTANCE_URL);
  }

  /**
   * Chooses the default project.
   */
  static async chooseProject(): Promise<any> {
    await Util.waitForPresenceOfElementById('application_form');

    const waitElementawait: any = await Util.waitForPresenceOfElementById('singleProjectNameSpan', 15000);
    if (!waitElementawait) {
      await Util.waitForPresenceOfElementById(this.PROJECT_SELECT_ID);
      await Util.waitForElementToBeClickableById(this.PROJECT_SELECT_ID);
      console.log('Getting option from select');
      await Util.clickOptionOfSelect(this.PROJECT_NAME, this.PROJECT_SELECT_ID);
    } else {
      console.log('Single Project automatically selected');
    }
  }

  /**
   * Fills the form with default values.
   * @param name Name of the new vm.
   */
  static async fillBasicForm(name: string = this.BASIC_VM_NAME): Promise<any> {
    Util.logMethodCall('Fill new instance basic form');

    await this.fillMandatoryFormWith(name, this.DEFAULT_FLAVOR_TITLE, this.UBUNTU_18_TITLE);
  }

  /**
   * Fills the form with the default values, also for volume.
   */
  static async fillBasicVolumeForm(): Promise<any> {
    Util.logMethodCall('Fill new instance basic volume form');

    await this.fillMandatoryFormWith(this.VOLUME_VM_NAME, this.DEFAULT_FLAVOR_TITLE, this.UBUNTU_18_TITLE);
  }

  /**
   * Fills the new vm form.
   * @param instance_name Name of the new instance
   * @param flavor flavor name to use
   * @param image image name to use
   */
  static async fillMandatoryFormWith(instance_name: string, flavor: string, image: string): Promise<any> {
    Util.logMethodCall('Fill new instance mandatory form');

    await Util.waitForPresenceOfElementById(this.ID_INSTANCE_NAME);
    await Util.sendTextToElementById(this.ID_INSTANCE_NAME, instance_name);
    await Util.waitForPresenceOfElementById(this.FLAVOR_ID);
    await element(by.id(this.FLAVOR_ID)).element(by.id(`${this.FLAVOR_PREFIX}${flavor}`)).click();
    await Util.waitForPresenceOfElementById(this.IMAGE_ID, Util.LONG_TIMEOUT);
    await element(by.id(this.IMAGE_ID)).element(by.id(`${this.IMAGE_PREFIX}${image}`)).click();
  }

  /**
   * Press the submit btn and starts a new vm.
   */
  static async submitAndStartVM(): Promise<any> {
    Util.logMethodCall('Submit and start VM');

    await Util.waitForElementToBeClickableById(this.START_BUTTON);
    await Util.clickElementById(this.START_BUTTON);
    // await Util.waitForPage('/virtualmachines/vmOverview')
  }

  /**
   * Waits till redirect modal is present.
   */
  static async isRedirectModalPresent(): Promise<boolean> {
    return await Util.waitForPresenceOfElementById(this.REDIRECT_MODAL);

  }

  /**
   * Sets the volume default values.
   */
  static async setVolume(): Promise<any> {
    Util.logMethodCall('Set Volume');

    await Util.clickElementById(this.ADD_VOLUME_FORM_BUTTON);
    console.log('Setting Volume name');
    await Util.sendTextToElementById(this.VOLUME_NAME_ID, Util.VOLUME_NAME);
    console.log('Setting Volume mount path');
    await Util.sendTextToElementById(this.VOLUME_MOUNT_PATH_ID, Util.VOLUME_MOUNT_PATH_STRING);

    console.log('Setting Volume space');
    await Util.sendTextToElementById(this.VOLUME_SPACE_ID, this.VOLUME_SPACE);
    await Util.clickElementById(this.ADD_VOLUME_CONFIRMATION_BUTTON);
  }

  /**
   * Get the name of the new started vm.
   */
  static async getVMName(): Promise<string> {
    await Util.waitForPresenceOfElementById(this.REDIRECT_MODAL);
    await Util.waitForPresenceOfElementById(this.NEW_INSTANCE_NAME_SPAN);

    return await element(by.id(this.NEW_INSTANCE_NAME_SPAN)).getAttribute('textContent');
  }

}
