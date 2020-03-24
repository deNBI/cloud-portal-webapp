import {Util} from '../util';

/**
 * Instance Detail Page.
 */
export class VMDetailPage {

  private VM_NAME: string;
  private VM_DETAIL_URL: string = 'virtualmachines/detail/';
  private VM_DETAIL_FULL_URL: string;

  private ACTIVE_BADGE_PREFIX: string = 'active_badge';
  private SHUTOFF_BADGE_PREFIX: string = 'shutoff_badge';

  private VERIFY_STOP_BTN: string = 'verifyStopButton';
  private VERIFY_RESTART_BTN: string = 'verifyRestartButton';

  private SHUTOFF_BUTTON: string = 'stopVMButton';
  private RESUME_BUTTON: string = 'restartVMButton';
  private DELETE_BUTTON: string = 'deleteVMButton';
  private SNAPSHOT_BUTTON: string = 'createSnapshotVMButton';

  private STOP_MODAL: string = 'stop_modal';
  private SHUTOFF_SUCCESS: string = 'stop_success_div';
  private CLOSE_STOP_MODAL: string = 'close_stop_modal';

  private RESUME_MODAL: string = 'resume_modal';
  private RESUME_SUCCESS: string = 'resume_success_div';
  private CLOSE_RESUME_MODAL: string = 'close_resume_modal';

  private SNAPSHOT_NAME_MODAL: string = 'snapshot_name_modal';
  private SNAPSHOT_NAME_INPUT: string = 'snapshot_name_input';
  private SNAPSHOT_CREATE_BUTTON: string = 'snapshot_create_modal_button';
  private SNAPSHOT_RESULT_MODAL: string = 'snapshot_result_modal';
  private SNAPSHOT_DONE_DIV: string = 'snapshot_done';
  private CLOSE_SNAPSHOT_RESULT_BUTTON: string = 'snapshot_result_modal_close';

  private VERIFY_MODAL: string = 'verify_modal';
  private CONFIRM_DELETE_BUTTON: string = 'confirm_delete_button';
  private DELETE_SUCCESS: string = 'delete_success_div';
  private CLOSE_DELETE_MODAL: string = 'close_delete_modal';
  private VERIFY_RESTART_MODAL: string = 'submitRestartModal';
  private SUBMIT_STOP_MODAL: string = 'submitStopVmModal';

  /**
   * Set the  basic vm name
   * @param name
   */
  async setBasicVMName(name: string): Promise<any> {
    Util.logMethodCall(`Setting basic vm name as ${name}`);
    this.VM_NAME = name;
  }

  /**
   * Stops the basic vm.
   */
  async stopBasicVM(): Promise<any> {
    Util.logMethodCall(`Stopping Basic vm ${this.VM_NAME}`);
    await Util.waitForElementToBeClickableById(this.SHUTOFF_BUTTON, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.SHUTOFF_BUTTON);
    await Util.waitForElementToBeClickableById(this.VERIFY_STOP_BTN, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.VERIFY_STOP_BTN);
    await Util.waitForPresenceOfElementById(this.SHUTOFF_SUCCESS, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.CLOSE_STOP_MODAL);
    Util.logMethodCall('Stopping of Basic VM completed');
  }

  /**
   * Restarts the basic vm.
   */
  async restartBasicVM(): Promise<any> {
    Util.logMethodCall('Restarting basic VM');
    await Util.waitForElementToBeClickableById(this.RESUME_BUTTON, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.RESUME_BUTTON);
    await Util.waitForElementToBeClickableById(this.VERIFY_RESTART_BTN, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.VERIFY_RESTART_BTN);
    await Util.waitForPresenceOfElementById(this.RESUME_SUCCESS, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.CLOSE_RESUME_MODAL);
    Util.logMethodCall('Restarting of Basic VM completed');

  }

  /**
   * Creats a snapshot from the basic vm.
   */
  async createSnapshotBasicVM(): Promise<any> {
    Util.logMethodCall('Creating Snapshot of basic VM');
    await Util.waitForElementToBeClickableById(this.SNAPSHOT_BUTTON, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.SNAPSHOT_BUTTON);
    await Util.waitForPresenceOfElementById(this.SNAPSHOT_NAME_MODAL);
    await Util.sendTextToElementById(this.SNAPSHOT_NAME_INPUT, Util.ALTERNATIVE_SNAPSHOT_NAME);
    await Util.clickElementById(this.SNAPSHOT_CREATE_BUTTON);
    await Util.waitForPresenceOfElementById(this.SNAPSHOT_DONE_DIV, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.CLOSE_SNAPSHOT_RESULT_BUTTON);
    Util.logMethodCall('Creating of Snapshot finished');

  }

  /**
   * Deletes the basic vm.
   */
  async deleteBasicVM(): Promise<any> {
    Util.logMethodCall('Deleting Basic VM');
    await Util.waitForElementToBeClickableById(this.DELETE_BUTTON, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.DELETE_BUTTON);
    await Util.waitForElementToBeClickableById(this.CONFIRM_DELETE_BUTTON, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.CONFIRM_DELETE_BUTTON);
    await Util.waitForPresenceOfElementById(this.DELETE_SUCCESS, Util.LONG_TIMEOUT);
    await Util.clickElementById(this.CLOSE_DELETE_MODAL);
    Util.logMethodCall('Deleting of Basic VM finished');
  }
}
