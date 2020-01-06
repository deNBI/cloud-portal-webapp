import {browser, by, element} from 'protractor';
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

  private SHUTOFF_BUTTON_PREFIX: string = 'stopVMButton_';
  private RESUME_BUTTON_PREFIX: string = 'restartVMButton_';
  private DELETE_BUTTON_PREFIX: string = 'deleteVMButton_';
  private SNAPSHOT_BUTTON_PREFIX: string = 'createSnapshotVMButton_';

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

  async setBasicVMName(name: string): Promise<any> {
    Util.logMethodCall(`Setting basic vm name as ${name}`);
    this.VM_NAME = name;
  }

  async setFullURL(suffix: Promise<string>): Promise<any> {
    Util.logMethodCall('Setting full url based on url fetching in html');
    let tempString: string = await suffix;
    tempString = tempString.split('/').pop();
    this.VM_DETAIL_FULL_URL = this.VM_DETAIL_URL + tempString;
  }

  getVmName(): string {
    return this.VM_NAME;
  }
}
