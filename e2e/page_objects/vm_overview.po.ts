import {browser, by, element} from 'protractor';
import {Util} from '../util';

/**
 * Instance Overview Page.
 */
export class VMOverviewPage {

  private VM_OVERVIEW_URL: string = 'virtualmachines/vmOverview';
  private TABLE_ID: string = 'vm_overview_table';
  private LONG_TIMEOUT: number = Util.LONG_TIMEOUT;

  private SHOW_ACTIONS_PREFIX: string = 'showActionsButton_';
  private ACTIVE_BADGE_PREFIX: string = 'active_badge_';
  private SHUTOFF_BADGE_PREFIX: string = 'shutoff_badge_';
  private DELETED_BADGE_PREFIX: string = 'deleted_badge_';
  private CHECKBOX_DELETED: string = 'checkbox_deleted';
  private VERIFY_STOP_BTN: string = 'verifyStopButton';
  private VERIFY_RESTART_BTN: string = 'verifyRestartButton';
  private DETAIL_PRE: string = 'showDetailsButton_';
  private DETAIL_LINK: string = 'detail_';

  private SHUTOFF_BUTTON_PREFIX: string = 'stopVMButton_';
  private RESUME_BUTTON_PREFIX: string = 'restartVMButton_';
  private DELETE_BUTTON_PREFIX: string = 'deleteVMButton_';
  private SNAPSHOT_BUTTON_PREFIX: string = 'createSnapshotVMButton_';

  private SNAPSHOT_NAME_MODAL: string = 'snapshot_name_modal';
  private SNAPSHOT_NAME_INPUT: string = 'snapshot_name_input';
  private SNAPSHOT_CREATE_BUTTON: string = 'snapshot_create_modal_button';
  private SNAPSHOT_RESULT_MODAL: string = 'snapshot_result_modal';
  private SNAPSHOT_DONE_DIV: string = 'snapshot_done';
  private CLOSE_SNAPSHOT_RESULT_BUTTON: string = 'snapshot_result_modal_close';

  private VERIFY_MODAL: string = 'verify_modal';
  private CONFIRM_DELETE_BUTTON: string = 'confirm_delete_button';

  private VERIFY_RESTART_MODAL: string = 'submitRestartModal';
  private SUBMIT_STOP_MODAL: string = 'submitStopVmModal';

  private BASIC_VM_NAME_KEY: string = 'basic_vm_name';
  private VOLUME_VM_NAME_KEY: string = 'volume_vm_name';
  private vm_names: { [key: string]: string } = {};
  private name_counter: number = 0;

  /**
   * Navigates to the VM Overview page.
   */
  async navigateToOverview(): Promise<any> {
    Util.logMethodCall('Navigating to VM Overview Page');
    await Util.navigateToAngularPage(this.VM_OVERVIEW_URL);
    await Util.waitForPage(this.VM_OVERVIEW_URL, this.LONG_TIMEOUT);

    return await browser.driver.sleep(10000);
  }

  /**
   * Sets the basic vm name for the component.
   * @param name
   */
  async setBasicVMName(name: string): Promise<any> {
    Util.logMethodCall(`Setting basic vm name as ${name}`);
    this.vm_names[this.BASIC_VM_NAME_KEY] = name;
    this.name_counter += 1;
  }

  /**
   * Sets the volume name for the component.
   * @param name
   */
  async setVolumeVMName(name: string): Promise<any> {
    Util.logMethodCall(`Setting volume vm name as ${name}`);
    this.vm_names[this.VOLUME_VM_NAME_KEY] = name;
    this.name_counter += 1;
  }

  /**
   * Checks if vm is active.
   * @param name Name of the vm
   */
  async isVmActive(name: string): Promise<boolean> {
    Util.logMethodCall(`Checking if ${name} is active`);
    await Util.waitForPresenceOfElementById(this.TABLE_ID);

    return await Util.waitForPresenceOfElementById(`${this.ACTIVE_BADGE_PREFIX}${name}`, this.LONG_TIMEOUT);
  }

  /**
   * Checks if the vm with the basis name is active.
   */
  async isBasicVMActive(): Promise<boolean> {
    return await this.isVmActive(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  /**
   * Checks if all vms are active.
   */
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

  /**
   * Checks if vm is shutoff.
   * @param name Name of the vm
   */
  async isVMShutoff(name: string): Promise<boolean> {
    Util.logMethodCall(`Checking if ${name} is shutoff`);
    await Util.waitForPresenceOfElementById(this.TABLE_ID);

    return await Util.waitForPresenceOfElementById(`${this.SHUTOFF_BADGE_PREFIX}${name}`, this.LONG_TIMEOUT);
  }

  /**
   * Checks if  vm with basic name is shutoff.
   */
  async isBasicVMShutoff(): Promise<boolean> {
    return await this.isVMShutoff(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  /**
   * Checks if vm is deleted.
   * @param name Name of the vm
   */
  async isVMDeleted(name: string): Promise<boolean> {
    Util.logMethodCall(`Checking if ${name} is deleted`);

    await Util.waitForPresenceOfElementById(this.TABLE_ID);

    return await Util.waitForPresenceOfElementById(`${this.DELETED_BADGE_PREFIX}${name}`);
  }

  /**
   * Shutoff a vm.
   * @param name name of the vm
   */
  async shutoffVM(name: string): Promise<any> {
    Util.logMethodCall(`Shutting off ${name}`);
    await Util.waitForPresenceOfElementById(`${this.ACTIVE_BADGE_PREFIX}${name}`);
    await Util.clickElementById(`${this.SHOW_ACTIONS_PREFIX}${name}`);
    await Util.clickElementById(`${this.SHUTOFF_BUTTON_PREFIX}${name}`);
    await Util.waitForPresenceOfElementById(this.SUBMIT_STOP_MODAL);
    await Util.clickElementById(this.VERIFY_STOP_BTN);
    await browser.sleep(1000);

    Util.logMethodCall(`Shutoff method for ${name} completed`)
  }

  /**
   * Shutoff the vm with the basic name.
   */
  async shutOffBasicVM(): Promise<any> {
    return await this.shutoffVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  /**
   * Resume a vm.
   * @param name Name of the vm.
   */
  async resumeVM(name: string): Promise<any> {
    Util.logMethodCall(`Resume vm ${name}`);
    await Util.waitForPresenceOfElementById(`${this.SHUTOFF_BADGE_PREFIX}${name}`);
    await Util.clickElementById(`${this.SHOW_ACTIONS_PREFIX}${name}`);
    await Util.clickElementById(`${this.RESUME_BUTTON_PREFIX}${name}`);
    await Util.waitForPresenceOfElementById(this.VERIFY_RESTART_MODAL);
    await Util.clickElementById(this.VERIFY_RESTART_BTN);
    await browser.sleep(1000);
    Util.logMethodCall(`Resuming method for ${name} completed`)
  }

  /**
   * Resume the basic vm.
   */
  async resumeBasicVM(): Promise<any> {
    return await this.resumeVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  /**
   * Gets the name of the basic vm.
   */
  async getBasicVMName(): Promise<string> {
    if (this.vm_names[this.BASIC_VM_NAME_KEY]) {
      return this.vm_names[this.BASIC_VM_NAME_KEY];
    } else {
      return '';
    }
  }

  async getNewBasicVMName(): Promise<string> {
    const basicName: string = await Util.getTextFromLinkElement(this.DETAIL_LINK, Util.BASIC_VM_NAME);

    return basicName;
  }

  async getNewVolumeVMName(): Promise<string> {
    const volumeName: string = await Util.getTextFromLinkElement(this.DETAIL_LINK, Util.VOLUME_VM_NAME);

    return volumeName;
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
    if (element(by.id(`${this.SHOW_ACTIONS_PREFIX}${name}`)).isPresent()) {
      await Util.clickElementById(`${this.SHOW_ACTIONS_PREFIX}${name}`);
    }

    await Util.clickElementById(`${this.DELETE_BUTTON_PREFIX}${name}`);
    await Util.waitForPresenceOfElementById(this.VERIFY_MODAL);
    await Util.clickElementById(this.CONFIRM_DELETE_BUTTON);
    await Util.waitForPresenceOfElementById(`${this.DELETED_BADGE_PREFIX}${name}`, this.LONG_TIMEOUT);

    Util.logMethodCall(`Deletion method for ${name} completed`)
  }

  /**
   * Deletes the basic vm.
   */
  async deleteBasicVM(): Promise<any> {
    return await this.deleteVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  /**
   * Delete the volume vm.
   */
  async deleteVolumeVM(): Promise<any> {
    return await this.deleteVM(this.vm_names[this.VOLUME_VM_NAME_KEY]);
  }

  /**
   * Creates a snapshot from a vm.
   * @param name Name of the vm.
   */
  async createSnapshotOfVM(name: string): Promise<any> {
    Util.logMethodCall(`Creating snapshot of ${name}`);

    if (element(by.id(`${this.SHOW_ACTIONS_PREFIX}${name}`)).isPresent()) {
      await Util.clickElementById(`${this.SHOW_ACTIONS_PREFIX}${name}`);
    }
    await Util.clickElementById(`${this.SNAPSHOT_BUTTON_PREFIX}${name}`);
    await Util.waitForPresenceOfElementById(this.SNAPSHOT_NAME_MODAL);
    await Util.sendTextToElementById(this.SNAPSHOT_NAME_INPUT, Util.BASIC_SNAPSHOT_NAME);
    await Util.clickElementById(this.SNAPSHOT_CREATE_BUTTON);
    await Util.waitForPresenceOfElementById(this.SNAPSHOT_RESULT_MODAL);
    await Util.waitForPresenceOfElementById(this.SNAPSHOT_DONE_DIV);
    await Util.clickElementById(this.CLOSE_SNAPSHOT_RESULT_BUTTON);
    Util.logMethodCall(`Creating snapshot method for ${name} completed`);
  }

  /**
   * Creats a snapshot from the basic vm.
   */
  async createSnapshotOfBasicVM(): Promise<any> {
    return await this.createSnapshotOfVM(this.vm_names[this.BASIC_VM_NAME_KEY]);

  }

  /**
   * Navigate to the vm detail page of the basic vm.
   */
  async goToVmDetail(): Promise<any> {
    const vm_name: string = await this.getBasicVMName();

    await this.isVmActive(vm_name);
    Util.logMethodCall(`Going to VM Detail page for ${this.vm_names[this.BASIC_VM_NAME_KEY]}`);

    return await Util.clickElementById(`${this.DETAIL_PRE}${vm_name}`)
  }

}
