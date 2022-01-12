import {browser} from 'protractor';
import {Util} from '../util';

/**
 * Volume Overview Page.
 */
export class VolumeOverviewPage {

  private static VOLUME_OVERVIEW_URL: string = 'virtualmachines/volumeOverview';
  private static CREATE_ATTACH_BUTTON: string = 'create_attach_button';

  private static TABLE_ID: string = 'volume_table_body';
  private static VOLUME_NAME_CELL_ID_PREFIX: string = 'cell_name_id_';
  private static VOLUME_DELETED_STATUS_BADE_PRE: string = 'deleted_badge_'
  private static VM_NAME_CELL_ID_PREFIX: string = 'cell_vm_id_';
  private static VM_CELL_FREE_ID: string = 'cell_vm_free_id';
  private static DELETE_BUTTON_PREFIX: string = 'delete_button_';
  private static VERIFY_MODAL: string = 'verify_modal';
  private static VERIFY_DELETION_BUTTON: string = 'verify_deletion_button';

  private static RESULT_MODAL: string = 'result_modal';
  private static SUCCESS_CA_DIV: string = 'successfully_created_attached_div';
  private static SUCCESS_DELETED_DIV: string = 'successfully_deleted_div';
  private static CLOSE_RESULT_MODAL: string = 'close_result_modal';

  private static CREATE_MODAL: string = 'create_modal';
  private static PROJECT_SELECT_ID: string = 'select_project_id';
  private static OPTION_PROJECT_PREFIX: string = 'project_option_';
  private static VM_SELECT_ID: string = 'select_vm_id';
  private static OPTION_VM_PREFIX: string = 'vm_option_';
  private static NAME_INPUT_ID: string = 'name_input_id';
  private static SPACE_INPUT_ID: string = 'space_input_id';
  private static VERIFY_CA_BUTTON: string = 'verify_create_attach_button';

  static async navigateToVolumeOverview(): Promise<any> {
    Util.logInfo('Navigating to volume overview');
    await Util.navigateToAngularPage(this.VOLUME_OVERVIEW_URL);
  }

  static async isVolumePresent(): Promise<boolean> {
    return await Util.waitForPresenceOfElementById(`${this.VOLUME_NAME_CELL_ID_PREFIX}${Util.VOLUME_NAME}`);
  }

  static async deleteVolume(): Promise<any> {
    Util.logInfo('Deleting Volume');
    await Util.clickElementById(this.DELETE_BUTTON_PREFIX + Util.VOLUME_NAME);
    await Util.waitForVisibilityOfElementById(this.VERIFY_MODAL);
    await Util.clickElementById(this.VERIFY_DELETION_BUTTON);
  }

  static async createAndAttachVolumeToProjectVm(vm: string): Promise<any> {
    Util.logInfo(` creating and attach volume to project: ${Util.SIMPLE_VM_APPLICATION_NAME} vm: ${vm}`);

    await Util.clickElementById(this.CREATE_ATTACH_BUTTON);
    await Util.waitForVisibilityOfElementById(this.CREATE_MODAL);
    await Util.clickOptionOfSelect(`${this.OPTION_PROJECT_PREFIX}${Util.SIMPLE_VM_APPLICATION_NAME}`, this.PROJECT_SELECT_ID);
    await browser.sleep(2000).then().catch();
    await Util.waitForPresenceOfElementById(this.VM_SELECT_ID);
    await Util.clickOptionOfSelect(`${this.OPTION_VM_PREFIX}${vm}`, this.VM_SELECT_ID);
    await Util.sendTextToElementByIdUnsecure(this.NAME_INPUT_ID, Util.VOLUME_NAME);
    await Util.sendTextToElementByIdUnsecure(this.SPACE_INPUT_ID, Util.VOLUME_SPACE);
    await Util.clickElementById(this.VERIFY_CA_BUTTON);

    Util.logInfo(' creating and attaching probably successful');
  }

  static async isVolumeDeleted(): Promise<boolean> {
    await Util.waitForPresenceOfElementById(this.TABLE_ID);

    return Util.waitForPresenceOfElementById(`${this.VOLUME_DELETED_STATUS_BADE_PRE}${Util.VOLUME_NAME}`)

  }

  static async isVolumeAttachedToVM(name: string): Promise<boolean> {
    Util.logInfo(` checking if volume attached to ${name}`);

    return await Util.waitForPresenceOfElementById(`${this.VM_NAME_CELL_ID_PREFIX}${name}`);
  }

  static async isVolumeFree(): Promise<boolean> {
    Util.logInfo(` checking if volume is free`);

    return await Util.waitForPresenceOfElementById(`available_${Util.VOLUME_NAME}`);

  }
}
