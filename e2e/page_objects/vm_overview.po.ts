import {browser, by, element} from 'protractor';
import {Util} from '../util';

/**
 * Instance Overview Page.
 */
export class VMOverviewPage {

  private VM_OVERVIEW_URL: string = 'virtualmachines/vmOverview';
  private TABLE_ID: string = 'vm_overview_table';
  private ROW_PREFIX: string = 'id_table_row_';
  private LONG_TIMEOUT: number = Util.LONG_TIMEOUT;

  private ACTIVE_BADGE_PREFIX: string = 'active_badge_';
  private SHUTOFF_BADGE_PREFIX: string = 'shutoff_badge_';
  private DELETED_BADGE_PREFIX: string = 'delete_badge_';
  private CHECKBOX_DELETED: string = 'checkbox_deleted';
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
  private DELETE_MODAL: string = 'delete_modal';
  private CONFIRM_DELETE_BUTTON: string = 'confirm_delete_button';
  private DELETE_SUCCESS: string = 'delete_success_div';
  private CLOSE_DELETE_MODAL: string = 'close_delete_modal';

  private SEARCH_SPINNER: string = 'search_spinner';

  private BASIC_VM_NAME_KEY: string = 'basic_vm_name';
  private VOLUME_VM_NAME_KEY: string = 'volume_vm_name';
  private vm_names: { [key: string]: string } = {};
  private name_counter: number = 0;

  async navigateToOverview(): Promise<any> {
    Util.logMethodCall('Navigating to VM Overview Page');
    await Util.navigateToAngularPage(this.VM_OVERVIEW_URL);
    await Util.waitForPage(this.VM_OVERVIEW_URL);

    return await browser.driver.sleep(10000);
  }

  async setBasicVMName(name: string): Promise<any> {
    Util.logMethodCall(`Setting basic vm name as ${name}`);
    this.vm_names[this.BASIC_VM_NAME_KEY] = name;
    this.name_counter += 1;
  }

  async setVolumeVMName(name: string): Promise<any> {
    Util.logMethodCall(`Setting volume vm name as ${name}`);
    this.vm_names[this.VOLUME_VM_NAME_KEY] = name;
    this.name_counter += 1;
  }

  async isVmActive(name: string): Promise<boolean> {
    Util.logMethodCall(`Checking if ${name} is active`);

    await Util.waitForPresenceOfElementById(this.TABLE_ID);

    return await Util.waitForPresenceOfElementById(`${this.ACTIVE_BADGE_PREFIX}${name}`);
  }

  async isBasicVMActive(): Promise<boolean> {
    return await this.isVmActive(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async areAllVMActive(): Promise<boolean> {
    Util.logMethodCall(`Checking active for ${this.name_counter} active vm`);

    for (const key in this.vm_names) {
      if (key in this.vm_names) {
        const val: any = this.vm_names[key];
        console.log(`Key: ${key} Value: ${val}`);
        this.name_counter -= 1;
        if (!this.isVmActive(val)) {
          return false;
        }
      }
    }

    return true;
  }

  async isVMShutoff(name: string): Promise<boolean> {
    Util.logMethodCall(`Checking if ${name} is shutoff`);
    await Util.waitForPresenceOfElementById(this.TABLE_ID);

    return await Util.waitForPresenceOfElementById(`${this.SHUTOFF_BADGE_PREFIX}${name}`);
  }

  async isBasicVMShutoff(): Promise<boolean> {
    return await this.isVMShutoff(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async showDeleted(): Promise<any> {
    console.log('Showing all deleted VM');
    await Util.clickElementById(this.CHECKBOX_DELETED);
  }

  async isVMDeleted(name: string): Promise<boolean> {
    Util.logMethodCall(`Checking if ${name} is deleted`);

    await Util.waitForPresenceOfElementById(this.TABLE_ID);

    return await Util.waitForPresenceOfElementById(`${this.DELETED_BADGE_PREFIX}${name}`);
  }

  async isBasicVMDeleted(): Promise<boolean> {
    return await this.isVMDeleted(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async isVolumeVMDeleted(): Promise<boolean> {
    return await this.isVMDeleted(this.vm_names[this.VOLUME_VM_NAME_KEY]);
  }

  async shutoffVM(name: string): Promise<any> {
    Util.logMethodCall(`Shutting off ${name}`);

    await Util.clickElementById(`${this.SHUTOFF_BUTTON_PREFIX}${name}`);
    await Util.clickElementById(this.VERIFY_STOP_BTN);
    await Util.waitForPresenceByElement(
      element(by.id(this.STOP_MODAL)).element(by.id(this.SHUTOFF_SUCCESS)),
      this.LONG_TIMEOUT,
      this.SHUTOFF_SUCCESS
    );
    await Util.clickElementById(this.CLOSE_STOP_MODAL);
    await browser.sleep(1000);

    Util.logMethodCall(`Shutoff method for ${name} completed`)
  }

  async shutOffBasicVM(): Promise<any> {
    return await this.shutoffVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async resumeVM(name: string): Promise<any> {
    Util.logMethodCall(`Resuming ${name}`);

    await Util.clickElementById(`${this.RESUME_BUTTON_PREFIX}${name}`);
    await Util.clickElementById(this.VERIFY_RESTART_BTN),
      await Util.waitForPresenceByElement(
        element(by.id(this.RESUME_MODAL)).element(by.id(this.RESUME_SUCCESS)),
        this.LONG_TIMEOUT,
        this.RESUME_SUCCESS
      );
    await Util.clickElementById(this.CLOSE_RESUME_MODAL);
    await browser.sleep(1000);
    Util.logMethodCall(`Resuming method for ${name} completed`)
  }

  async resumeBasicVM(): Promise<any> {
    return await this.resumeVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async getBasicVMName(): Promise<string> {
    if (this.vm_names[this.BASIC_VM_NAME_KEY]) {
      return this.vm_names[this.BASIC_VM_NAME_KEY];
    } else {
      return '';
    }
  }

  async getVolumeVMName(): Promise<string> {
    if (this.vm_names[this.VOLUME_VM_NAME_KEY]) {
      return this.vm_names[this.VOLUME_VM_NAME_KEY];
    } else {
      return '';
    }
  }

  async deleteVM(name: string): Promise<any> {
    Util.logMethodCall(`Deleting ${name}`);

    await Util.clickElementById(`${this.DELETE_BUTTON_PREFIX}${name}`);

    await Util.waitForPresenceOfElementById(this.VERIFY_MODAL);
    await Util.clickElementById(this.CONFIRM_DELETE_BUTTON);
    await Util.waitForPresenceOfElementById(this.DELETE_SUCCESS, this.LONG_TIMEOUT);
    await Util.clickElementById(this.CLOSE_DELETE_MODAL);
    console.log(`Deletion method for ${name} completed`)
  }

  async deleteBasicVM(): Promise<any> {
    return await this.deleteVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async deleteVolumeVM(): Promise<any> {
    return await this.deleteVM(this.vm_names[this.VOLUME_VM_NAME_KEY]);
  }

  async createSnapshotOfVM(name: string): Promise<any> {
    Util.logMethodCall(`Creating snapshot of ${name}`);

    await Util.clickElementById(`${this.SNAPSHOT_BUTTON_PREFIX}${name}`);
    await Util.waitForPresenceOfElementById(this.SNAPSHOT_NAME_MODAL);
    await Util.sendTextToElementById(this.SNAPSHOT_NAME_INPUT, Util.BASIC_SNAPSHOT_NAME);
    await Util.clickElementById(this.SNAPSHOT_CREATE_BUTTON);
    await Util.waitForPresenceOfElementById(this.SNAPSHOT_RESULT_MODAL);
    await Util.waitForPresenceOfElementById(this.SNAPSHOT_DONE_DIV);
    await Util.clickElementById(this.CLOSE_SNAPSHOT_RESULT_BUTTON);
    Util.logMethodCall(`Creating snapshot method for ${name} completed`);
  }

  async createSnapshotOfBasicVM(): Promise<any> {
    return await this.createSnapshotOfVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }
}
