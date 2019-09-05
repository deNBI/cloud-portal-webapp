import ***REMOVED***by, element***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from '../util';

export class VolumeOverviewPage ***REMOVED***

  private static VOLUME_OVERVIEW_URL: string = 'virtualmachines/volumeOverview';
  private static CREATE_ATTACH_BUTTON: string = 'create_attach_button';

  private static TABLE_ID: string = 'volume_table_body';
  private static VOLUME_NAME_CELL_ID_PREFIX: string = 'cell_name_id_';
  private static VM_NAME_CELL_ID_PREFIX: string = 'cell_vm_id_';
  private static VM_CELL_FREE_ID: string = 'cell_vm_free_id';
  private static DELETE_BUTTON: string = 'delete_button';

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

  static async navigateToVolumeOverview(): Promise<any> ***REMOVED***
    console.log('Navigating to volume overview');
    await Util.navigateToAngularPage(this.VOLUME_OVERVIEW_URL);
  ***REMOVED***

  static async isVolumePresent(): Promise<boolean> ***REMOVED***
    await Util.waitForPresenceByElement(element(by.id(this.TABLE_ID))
                                          .element(by.id(`$***REMOVED***this.VOLUME_NAME_CELL_ID_PREFIX***REMOVED***$***REMOVED***Util.VOLUME_NAME***REMOVED***`)),
                                        Util.timeout,
                                        Util.VOLUME_NAME);

    return await element(by.id(this.TABLE_ID)).element(by.id(`$***REMOVED***this.VOLUME_NAME_CELL_ID_PREFIX***REMOVED***$***REMOVED***Util.VOLUME_NAME***REMOVED***`)).isPresent();
  ***REMOVED***

  static async deleteVolume(): Promise<any> ***REMOVED***
    console.log(' deleting volume');
    await Util.clickElementByElement(element(by.id(this.TABLE_ID)).element(by.id(this.DELETE_BUTTON)));
    await Util.waitForVisibilityOfElementById(this.VERIFY_MODAL);
    await Util.clickElementById(this.VERIFY_DELETION_BUTTON);
    await Util.waitForPresenceOfElementById(this.SUCCESS_DELETED_DIV);
    await Util.clickElementById(this.CLOSE_RESULT_MODAL);
    await Util.waitForInvisibilityOfElementById(this.RESULT_MODAL);
  ***REMOVED***

  static async createAndAttachVolumeToProjectVm(vm: string): Promise<any> ***REMOVED***
    console.log(` creating and attach volume to project: $***REMOVED***Util.SIMPLE_VM_APPLICATION_NAME***REMOVED*** vm: $***REMOVED***vm***REMOVED***`);
    await Util.clickElementById(this.CREATE_ATTACH_BUTTON);
    await Util.waitForVisibilityOfElementById(this.CREATE_MODAL);
    await Util.clickOptionOfSelect(`$***REMOVED***this.OPTION_PROJECT_PREFIX***REMOVED***$***REMOVED***Util.SIMPLE_VM_APPLICATION_NAME***REMOVED***`, this.PROJECT_SELECT_ID);
    await Util.clickOptionOfSelect(`$***REMOVED***this.OPTION_VM_PREFIX***REMOVED***$***REMOVED***vm***REMOVED***`, this.VM_SELECT_ID);
    await Util.sendTextToElementById(this.NAME_INPUT_ID, Util.VOLUME_NAME);
    await Util.sendTextToElementById(this.SPACE_INPUT_ID, Util.VOLUME_SPACE);
    await Util.clickElementById(this.VERIFY_CA_BUTTON);

    await Util.waitForVisibilityOfElementById(this.RESULT_MODAL);
    await Util.waitForPresenceOfElementById(this.SUCCESS_CA_DIV);
    console.log(' creating and attaching probably successful');
    await Util.clickElementById(this.CLOSE_RESULT_MODAL);
    await Util.waitForInvisibilityOfElementById(this.RESULT_MODAL);
  ***REMOVED***

  static async isVolumeDeleted(): Promise<boolean> ***REMOVED***
    await Util.waitForPresenceOfElementById(this.TABLE_ID);

    return await Util.waitForAbsenceOfElementById(`$***REMOVED***this.VOLUME_NAME_CELL_ID_PREFIX***REMOVED***$***REMOVED***Util.VOLUME_NAME***REMOVED***`);
  ***REMOVED***

  static async isVolumeAttachedToVM(name: string): Promise<boolean> ***REMOVED***
    console.log(` checking if volume attached to $***REMOVED***name***REMOVED***`);
    await Util.waitForPresenceByElement(element(by.id(this.TABLE_ID))
                                          .element(by.id(`$***REMOVED***this.VM_NAME_CELL_ID_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`)),
                                        Util.timeout,
                                        name);

    return await element(by.id(this.TABLE_ID)).element(by.id(`$***REMOVED***this.VM_NAME_CELL_ID_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`)).isPresent();
  ***REMOVED***

  static async isVolumeFree(): Promise<boolean> ***REMOVED***
    console.log(` checking if volume is free`);
    await Util.waitForPresenceByElement(element(by.id(this.TABLE_ID))
                                          .element(by.id(this.VM_CELL_FREE_ID)),
                                        Util.timeout,
                                        this.VM_CELL_FREE_ID);

    return await element(by.id(this.TABLE_ID)).element(by.id(this.VM_CELL_FREE_ID)).isPresent();
  ***REMOVED***
***REMOVED***
