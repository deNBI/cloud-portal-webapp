import {browser, by, element} from 'protractor';
import {Util} from '../util';

export class VMOverviewPage {

  private VM_OVERVIEW_URL: string = 'virtualmachines/vmOverview';
  private TABLE_ID: string = 'vm_overview_table_body';
  private ROW_PREFIX: string = 'id_table_row_';

  private ACTIVE_BADGE: string = 'active_badge';
  private SHUTOFF_BADGE: string = 'shutoff_badge';
  private DELETED_BADGE: string = 'delete_badge';
  private CHECKBOX_DELETED: string = 'checkbox_deleted';

  private SELECT_BUTTON: string = 'select_button';
  private SHUTOFF_BUTTON: string = 'shutoff_button';
  private RESUME_BUTTON: string = 'resume_button';
  private DELETE_BUTTON: string = 'delete_vm_button';

  private STOP_MODAL: string = 'stop_modal';
  private SHUTOFF_SUCCESS: string = 'stop_success_div';
  private CLOSE_STOP_MODAL: string = 'close_stop_modal';

  private RESUME_MODAL: string = 'resume_modal';
  private RESUME_SUCCESS: string = 'resume_success_div';
  private CLOSE_RESUME_MODAL: string = 'close_resume_modal';

  private VERIFY_MODAL: string = 'verify_modal';
  private DELETE_MODAL: string = 'delete_modal';
  private CONFIRM_DELETE_BUTTON: string = 'confirm_delete_button';
  private DELETE_SUCCESS: string = 'delete_success_div';
  private CLOSE_DELETE_MODAL: string = 'close_delete_modal';

  private BASIC_VM_NAME_KEY: string = 'basic_vm_name';
  private VOLUME_VM_NAME_KEY: string = 'volume_vm_name';
  private vm_names: {[key: string]: string} = {};
  private name_counter: number = 0;

  async navigateToOverview(): Promise<any> {
    console.log('Navigating to VM Overview Page')
    await Util.navigateToAngularPage(this.VM_OVERVIEW_URL);

    return await Util.waitForPage(this.VM_OVERVIEW_URL);
  }

  async setBasicVMName(name: string): Promise<any> {
    console.log(`Setting basic vm name as ${name}`);
    this.vm_names[this.BASIC_VM_NAME_KEY] = name;
    this.name_counter += 1;
  }

  async setVolumeVMName(name: string): Promise<any> {
    console.log(`Setting volume vm name as ${name}`);
    this.vm_names[this.VOLUME_VM_NAME_KEY] = name;
    this.name_counter += 1;
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

  async isVmActive(name: string): Promise<boolean> {
    console.log(`Checking if ${name} is active`);
    await Util.waitForPresenceByElement(
      await element(by.id(this.TABLE_ID))
      .element(by.id(`${this.ROW_PREFIX}${name}`))
      .element(by.id(this.ACTIVE_BADGE)),
      Util.timeout,
      this.ACTIVE_BADGE);

    return await element(by.id(this.TABLE_ID)).element(by.id(`${this.ROW_PREFIX}${name}`)).element(by.id(this.ACTIVE_BADGE)).isPresent();
  }

  async isBasicVMActive(): Promise<boolean> {
    return await this.isVmActive(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async areAllVMActive(): Promise<boolean> {
    console.log(`Checking active for ${this.name_counter} active vm`);
    for (const key in this.vm_names) {
      const val = this.vm_names[key];
      console.log(`Key: ${key} Value: ${val}`);
      this.name_counter -= 1;
      if (await !this.isVmActive(val)) {
        return false;
      }
    }

    return true;
  }

  async isVMShutoff(name: string): Promise<boolean> {
    console.log(`Checking if ${name} is shutoff`);
    await Util.waitForPresenceByElement(
      element(by.id(this.TABLE_ID))
        .element(by.id(`${this.ROW_PREFIX}${name}`))
        .element(by.id(this.SHUTOFF_BADGE)),
      Util.timeout,
      this.SHUTOFF_BADGE);

    return await element(by.id(this.TABLE_ID)).element(by.id(`${this.ROW_PREFIX}${name}`)).element(by.id(this.SHUTOFF_BADGE))
      .isPresent();
  }

  async isBasicVMShutoff(): Promise<boolean> {
    return await this.isVMShutoff(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async showDeleted(): Promise<any> {
    console.log('Showing all deleted VM');
    await Util.clickElementById(this.CHECKBOX_DELETED);
  }

  async isVMDeleted(name: string): Promise<boolean> {
    console.log(`Checking if ${name} is deleted`);
    await Util.waitForPresenceByElement(
      element(by.id(this.TABLE_ID))
        .element(by.id(`${this.ROW_PREFIX}${name}`))
        .element(by.id(this.DELETED_BADGE)),
      Util.timeout,
      this.DELETED_BADGE);

    return await element(by.id(this.TABLE_ID)).element(by.id(`${this.ROW_PREFIX}${name}`)).element(by.id(this.DELETED_BADGE))
      .isPresent();
  }

  async isBasicVMDeleted(): Promise<boolean> {
    return await this.isVMDeleted(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async isVolumeVMDeleted(): Promise<boolean> {
    return await this.isVMDeleted(this.vm_names[this.VOLUME_VM_NAME_KEY]);
  }

  async clickSelectDropdown(name: string): Promise<any> {
    await Util.clickElementByElement(
      element(by.id(this.TABLE_ID))
       .element(by.id(`${this.ROW_PREFIX}${name}`))
       .element(by.id(this.SELECT_BUTTON)),
      Util.timeout,
      this.SELECT_BUTTON);
  }

  async shutoffVM(name: string): Promise<any> {
    console.log(`Shutting off ${name}`);
    await this.clickSelectDropdown(name);
    await element(by.id(this.TABLE_ID)).element(by.id(`${this.ROW_PREFIX}${name}`)).element(by.id(this.SHUTOFF_BUTTON)).click();
    await Util.waitForPresenceByElement(
      element(by.id(this.STOP_MODAL)).element(by.id(this.SHUTOFF_SUCCESS)),
      420000,
      this.SHUTOFF_SUCCESS
    );
    await Util.waitForPresenceByElement(element(by.id(this.STOP_MODAL)).element(by.id(this.CLOSE_STOP_MODAL)),
                                        Util.timeout,
                                        this.CLOSE_STOP_MODAL);
    await element(by.id(this.STOP_MODAL)).element(by.id(this.CLOSE_STOP_MODAL)).click();
    console.log(`Shutoff method for ${name} completed`)
  }

  async shutOffBasicVM(): Promise<any> {
    return await this.shutoffVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async resumeVM(name: string): Promise<any> {
    console.log(`Resuming ${name}`);
    await this.clickSelectDropdown(name);
    await element(by.id(this.TABLE_ID)).element(by.id(`${this.ROW_PREFIX}${name}`)).element(by.id(this.RESUME_BUTTON)).click();
    await Util.waitForPresenceByElement(
      element(by.id(this.RESUME_MODAL)).element(by.id(this.RESUME_SUCCESS)),
      420000,
      this.RESUME_SUCCESS
    );
    await element(by.id(this.RESUME_MODAL)).element(by.id(this.CLOSE_RESUME_MODAL)).click();
    console.log(`Resuming method for ${name} completed`)
  }

  async resumeBasicVM(): Promise<any> {
    return await this.resumeVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async deleteVM(name: string): Promise<any> {
    console.log(`Deleting ${name}`);
    await this.clickSelectDropdown(name);
    await Util.clickElementByElement(
      element(by.id(this.TABLE_ID))
        .element(by.id(`${this.ROW_PREFIX}${name}`))
        .element(by.id(this.DELETE_BUTTON)),
      Util.timeout,
      this.DELETE_BUTTON);
    await Util.waitForPresenceOfElementById(this.VERIFY_MODAL);
    await Util.clickElementByElement(element(by.id(this.VERIFY_MODAL)).element(by.id(this.CONFIRM_DELETE_BUTTON)),
                                     Util.timeout,
                                     this.CONFIRM_DELETE_BUTTON);
    await Util.waitForPresenceByElement(
      element(by.id(this.DELETE_MODAL)).element(by.id(this.DELETE_SUCCESS)),
      420000,
      this.DELETE_SUCCESS
    );
    await Util.clickElementByElement(element(by.id(this.DELETE_MODAL)).element(by.id(this.CLOSE_DELETE_MODAL)),
                                     Util.timeout,
                                     this.CLOSE_DELETE_MODAL);
    await Util.waitForInvisibilityOfElementByElement(element(by.id(this.DELETE_MODAL)));
    console.log(`Deletion method for ${name} completed`)
  }

  async deleteBasicVM(): Promise<any> {
    return await this.deleteVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  }

  async deleteVolumeVM(): Promise<any> {
    return await this.deleteVM(this.vm_names[this.VOLUME_VM_NAME_KEY]);
  }
}
