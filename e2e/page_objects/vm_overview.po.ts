import ***REMOVED***browser, by, element***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from '../util';

export class VMOverviewPage ***REMOVED***

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
  private vm_names: ***REMOVED***[key: string]: string***REMOVED*** = ***REMOVED******REMOVED***;
  private name_counter: number = 0;

  async navigateToOverview(): Promise<any> ***REMOVED***
    console.log('Navigating to VM Overview Page')
    await Util.navigateToAngularPage(this.VM_OVERVIEW_URL);
    await Util.waitForPage(this.VM_OVERVIEW_URL);

    return await browser.driver.sleep(10000);
  ***REMOVED***

  async setBasicVMName(name: string): Promise<any> ***REMOVED***
    console.log(`Setting basic vm name as $***REMOVED***name***REMOVED***`);
    this.vm_names[this.BASIC_VM_NAME_KEY] = name;
    this.name_counter += 1;
  ***REMOVED***

  async setVolumeVMName(name: string): Promise<any> ***REMOVED***
    console.log(`Setting volume vm name as $***REMOVED***name***REMOVED***`);
    this.vm_names[this.VOLUME_VM_NAME_KEY] = name;
    this.name_counter += 1;
  ***REMOVED***

  async getBasicVMName(): Promise<string> ***REMOVED***
    if (this.vm_names[this.BASIC_VM_NAME_KEY]) ***REMOVED***
      return this.vm_names[this.BASIC_VM_NAME_KEY];
    ***REMOVED*** else ***REMOVED***
      return '';
    ***REMOVED***
  ***REMOVED***

  async getVolumeVMName(): Promise<string> ***REMOVED***
    if (this.vm_names[this.VOLUME_VM_NAME_KEY]) ***REMOVED***
      return this.vm_names[this.VOLUME_VM_NAME_KEY];
    ***REMOVED*** else ***REMOVED***
      return '';
    ***REMOVED***
  ***REMOVED***

  async isVmActive(name: string): Promise<boolean> ***REMOVED***
    console.log(`Checking if $***REMOVED***name***REMOVED*** is active`);
    await Util.waitForPresenceByElement(
      await element(by.id(this.TABLE_ID))
      .element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`))
      .element(by.id(this.ACTIVE_BADGE)),
      Util.timeout,
      this.ACTIVE_BADGE);

    return await element(by.id(this.TABLE_ID)).element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`)).element(by.id(this.ACTIVE_BADGE)).isPresent();
  ***REMOVED***

  async isBasicVMActive(): Promise<boolean> ***REMOVED***
    return await this.isVmActive(this.vm_names[this.BASIC_VM_NAME_KEY]);
  ***REMOVED***

  async areAllVMActive(): Promise<boolean> ***REMOVED***
    console.log(`Checking active for $***REMOVED***this.name_counter***REMOVED*** active vm`);
    for (const key in this.vm_names) ***REMOVED***
      const val = this.vm_names[key];
      console.log(`Key: $***REMOVED***key***REMOVED*** Value: $***REMOVED***val***REMOVED***`);
      this.name_counter -= 1;
      if (await !this.isVmActive(val)) ***REMOVED***
        return false;
      ***REMOVED***
    ***REMOVED***

    return true;
  ***REMOVED***

  async isVMShutoff(name: string): Promise<boolean> ***REMOVED***
    console.log(`Checking if $***REMOVED***name***REMOVED*** is shutoff`);
    await Util.waitForPresenceByElement(
      element(by.id(this.TABLE_ID))
        .element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`))
        .element(by.id(this.SHUTOFF_BADGE)),
      Util.timeout,
      this.SHUTOFF_BADGE);

    return await element(by.id(this.TABLE_ID)).element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`)).element(by.id(this.SHUTOFF_BADGE))
      .isPresent();
  ***REMOVED***

  async isBasicVMShutoff(): Promise<boolean> ***REMOVED***
    return await this.isVMShutoff(this.vm_names[this.BASIC_VM_NAME_KEY]);
  ***REMOVED***

  async showDeleted(): Promise<any> ***REMOVED***
    console.log('Showing all deleted VM');
    await Util.clickElementById(this.CHECKBOX_DELETED);
  ***REMOVED***

  async isVMDeleted(name: string): Promise<boolean> ***REMOVED***
    console.log(`Checking if $***REMOVED***name***REMOVED*** is deleted`);
    await Util.waitForPresenceByElement(
      element(by.id(this.TABLE_ID))
        .element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`))
        .element(by.id(this.DELETED_BADGE)),
      Util.timeout,
      this.DELETED_BADGE);

    return await element(by.id(this.TABLE_ID)).element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`)).element(by.id(this.DELETED_BADGE))
      .isPresent();
  ***REMOVED***

  async isBasicVMDeleted(): Promise<boolean> ***REMOVED***
    return await this.isVMDeleted(this.vm_names[this.BASIC_VM_NAME_KEY]);
  ***REMOVED***

  async isVolumeVMDeleted(): Promise<boolean> ***REMOVED***
    return await this.isVMDeleted(this.vm_names[this.VOLUME_VM_NAME_KEY]);
  ***REMOVED***

  async clickSelectDropdown(name: string): Promise<any> ***REMOVED***
    await Util.clickElementByElement(
      element(by.id(this.TABLE_ID))
       .element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`))
       .element(by.id(this.SELECT_BUTTON)),
      Util.timeout,
      this.SELECT_BUTTON);
  ***REMOVED***

  async shutoffVM(name: string): Promise<any> ***REMOVED***
    console.log(`Shutting off $***REMOVED***name***REMOVED***`);
    await this.clickSelectDropdown(name);
    await Util.clickElementByElement(element(by.id(this.TABLE_ID))
                                       .element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`))
                                       .element(by.id(this.SHUTOFF_BUTTON)));
    await Util.waitForPresenceByElement(
      element(by.id(this.STOP_MODAL)).element(by.id(this.SHUTOFF_SUCCESS)),
      420000,
      this.SHUTOFF_SUCCESS
    );

    await Util.waitForPresenceByElement(element(by.id(this.STOP_MODAL)).element(by.id(this.CLOSE_STOP_MODAL)),
                                        Util.timeout,
                                        this.CLOSE_STOP_MODAL);
    await Util.clickElementByElement(element(by.id(this.STOP_MODAL)).element(by.id(this.CLOSE_STOP_MODAL)));
    console.log(`Shutoff method for $***REMOVED***name***REMOVED*** completed`)
  ***REMOVED***

  async shutOffBasicVM(): Promise<any> ***REMOVED***
    return await this.shutoffVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  ***REMOVED***

  async resumeVM(name: string): Promise<any> ***REMOVED***
    console.log(`Resuming $***REMOVED***name***REMOVED***`);
    await this.clickSelectDropdown(name);
    await Util.clickElementByElement(element(by.id(this.TABLE_ID))
                                       .element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`))
                                       .element(by.id(this.RESUME_BUTTON)));
    await Util.waitForPresenceByElement(
      element(by.id(this.RESUME_MODAL)).element(by.id(this.RESUME_SUCCESS)),
      420000,
      this.RESUME_SUCCESS
    );
    await Util.clickElementByElement(element(by.id(this.RESUME_MODAL)).element(by.id(this.CLOSE_RESUME_MODAL)));
    console.log(`Resuming method for $***REMOVED***name***REMOVED*** completed`)
  ***REMOVED***

  async resumeBasicVM(): Promise<any> ***REMOVED***
    return await this.resumeVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  ***REMOVED***

  async deleteVM(name: string): Promise<any> ***REMOVED***
    console.log(`Deleting $***REMOVED***name***REMOVED***`);
    await this.clickSelectDropdown(name);
    await Util.clickElementByElement(
      element(by.id(this.TABLE_ID))
        .element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`))
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
    console.log(`Deletion method for $***REMOVED***name***REMOVED*** completed`)
  ***REMOVED***

  async deleteBasicVM(): Promise<any> ***REMOVED***
    return await this.deleteVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  ***REMOVED***

  async deleteVolumeVM(): Promise<any> ***REMOVED***
    return await this.deleteVM(this.vm_names[this.VOLUME_VM_NAME_KEY]);
  ***REMOVED***
***REMOVED***
