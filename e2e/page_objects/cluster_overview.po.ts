import {browser, by, element} from 'protractor';
import {Util} from '../util';

/**
 * Instance Overview Page.
 */
export class VMOverviewPage {

  private CLUSTER_OVERVIEW_URL: string = 'virtualmachines/clusterOverview';


  async navigateToOverview(): Promise<any> {
    Util.logInfo('Navigating to Cluster Overview Page');
    await Util.navigateToAngularPage(this.CLUSTER_OVERVIEW_URL);
    await Util.waitForPage(this.CLUSTER_OVERVIEW_URL, Util.LONG_TIMEOUT);

    return await browser.driver.sleep(10000);
  }

  

  async isVmActive(name: string): Promise<boolean> {
    Util.logInfo(`Checking if ${name} is active`);
    await Util.waitForPresenceOfElementById(this.TABLE_ID);

    return await Util.waitForPresenceOfElementById(`${this.ACTIVE_BADGE_PREFIX}${name}`, this.LONG_TIMEOUT);
  }

  async isBasicVMActive(): Promise<boolean> {
    return await this.isVmActive(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async areAllVMActive(): Promise<boolean> {
    Util.logInfo(`Checking active for ${this.name_counter} active vm`);

    for (const key in this.vm_names) {
      if (key in this.vm_names) {
        const val: any = this.vm_names[key];
        console.log(`Key: ${key} Value: ${val}`);
        this.name_counter -= 1;
        if (!await this.isVmActive(val)) {
          return false;
        }
      }
    }

    return true;
  }

  async isVMShutoff(name: string): Promise<boolean> {
    Util.logInfo(`Checking if ${name} is shutoff`);
    await Util.waitForPresenceOfElementById(this.TABLE_ID);

    return await Util.waitForPresenceOfElementById(`${this.SHUTOFF_BADGE_PREFIX}${name}`, this.LONG_TIMEOUT);
  }

  async isBasicVMShutoff(): Promise<boolean> {
    return await this.isVMShutoff(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async showDeleted(): Promise<any> {
    console.log('Showing all deleted VM');
    await Util.clickElementById(this.CHECKBOX_DELETED);
  }

  async isVMDeleted(name: string): Promise<boolean> {
    Util.logInfo(`Checking if ${name} is deleted`);

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
    Util.logInfo(`Shutting off ${name}`);
    await Util.waitForPresenceOfElementById(`${this.ACTIVE_BADGE_PREFIX}${name}`);
    await Util.clickElementById(`${this.SHOW_ACTIONS_PREFIX}${name}`);
    await Util.clickElementById(`${this.SHUTOFF_BUTTON_PREFIX}${name}`);
    await Util.waitForPresenceOfElementById(this.SUBMIT_STOP_MODAL);
    await Util.clickElementById(this.VERIFY_STOP_BTN);
    await browser.sleep(1000);

    Util.logInfo(`Shutoff method for ${name} completed`)
  }

  async shutOffBasicVM(): Promise<any> {
    return await this.shutoffVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async resumeVM(name: string): Promise<any> {
    Util.logInfo(`Resume vm ${name}`);
    await Util.waitForPresenceOfElementById(`${this.SHUTOFF_BADGE_PREFIX}${name}`);
    await Util.clickElementById(`${this.SHOW_ACTIONS_PREFIX}${name}`);
    await Util.clickElementById(`${this.RESUME_BUTTON_PREFIX}${name}`);
    await Util.waitForPresenceOfElementById(this.VERIFY_RESTART_MODAL);
    await Util.clickElementById(this.VERIFY_RESTART_BTN);
    await browser.sleep(1000);
    Util.logInfo(`Resuming method for ${name} completed`)
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
    Util.logInfo(`Deleting ${name}`);
    if (element(by.id(`${this.SHOW_ACTIONS_PREFIX}${name}`)).isPresent()) {
      await Util.clickElementById(`${this.SHOW_ACTIONS_PREFIX}${name}`);
    }

    await Util.clickElementById(`${this.DELETE_BUTTON_PREFIX}${name}`);
    await Util.waitForPresenceOfElementById(this.VERIFY_MODAL);
    await Util.clickElementById(this.CONFIRM_DELETE_BUTTON);
    await Util.waitForPresenceOfElementById(`${this.DELETED_BADGE_PREFIX}${name}`, this.LONG_TIMEOUT);

    Util.logInfo(`Deletion method for ${name} completed`)
  }

  async deleteBasicVM(): Promise<any> {
    return await this.deleteVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async deleteVolumeVM(): Promise<any> {
    return await this.deleteVM(this.vm_names[this.VOLUME_VM_NAME_KEY]);
  }

  async createSnapshotOfVM(name: string): Promise<any> {
    Util.logInfo(`Creating snapshot of ${name}`);

    if (element(by.id(`${this.SHOW_ACTIONS_PREFIX}${name}`)).isPresent()) {
      await Util.clickElementById(`${this.SHOW_ACTIONS_PREFIX}${name}`);
    }
    await Util.clickElementById(`${this.SNAPSHOT_BUTTON_PREFIX}${name}`);
    await Util.waitForPresenceOfElementById(this.SNAPSHOT_NAME_MODAL);
    await Util.sendTextToElementByIdUnsecure(this.SNAPSHOT_NAME_INPUT, Util.BASIC_SNAPSHOT_NAME);
    await Util.clickElementById(this.SNAPSHOT_CREATE_BUTTON);
    await Util.waitForPresenceOfElementById(this.SNAPSHOT_RESULT_MODAL);
    await Util.waitForPresenceOfElementById(this.SNAPSHOT_DONE_DIV);
    await Util.clickElementById(this.CLOSE_SNAPSHOT_RESULT_BUTTON);
    Util.logInfo(`Creating snapshot method for ${name} completed`);
  }

  async createSnapshotOfBasicVM(): Promise<any> {
    return await this.createSnapshotOfVM(this.vm_names[this.BASIC_VM_NAME_KEY]);

  }

  async goToVmDetail(): Promise<any> {
    const vm_name: string = await this.getBasicVMName();

    await this.isVmActive(vm_name);
    Util.logInfo(`Going to VM Detail page for ${this.vm_names[this.BASIC_VM_NAME_KEY]}`);

    return await Util.clickElementById(`${this.DETAIL_PRE}${vm_name}`)
  }

}
