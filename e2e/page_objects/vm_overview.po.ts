import ***REMOVED***browser, by, element***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from '../util';

export class VMOverviewPage ***REMOVED***

  private VM_OVERVIEW_URL: string = 'virtualmachines/vmOverview';
  private TABLE_ID: string = 'vm_overview_table_body';
  private ROW_PREFIX: string = 'id_table_row_';
  private ACTIVE_BADGE: string = 'active_badge';
  private SHUTOFF_BADGE: string = 'shutoff_badge';
  private SHUTOFF_BUTTON: string = 'shutoff_button';
  private DELETED_BADGE: string = 'delete_badge';
  private RESUME_BUTTON: string = 'resume_button';
  private CLOSE_STOP_MODAL: string = 'close_stop_modal';
  private STOP_MODAL: string = 'stop_modal';
  private SHUTOFF_SUCCESS: string = 'stop_success_div';
  private CLOSE_RESUME_MODAL: string = 'close_resume_modal';
  private RESUME_MODAL: string = 'resume_modal';
  private RESUME_SUCCESS: string = 'resume_success_div';
  private SELECT_BUTTON: string = 'select_button';

  private CONFIRM_DELETE_BUTTON: string = 'confirm_delete_button';
  private DELETE_BUTTON: string = 'delete_button';
  private VERIFY_MODAL: string = 'verify_modal';
  private DELETE_MODAL: string = 'delete_modal';
  private CLOSE_DELETE_MODAL: string = 'close_delete_modal';
  private DELETE_SUCCESS: string = 'delete_success_div';

  private BASIC_VM_NAME_KEY: string = 'basic_vm_name';
  private VOLUME_VM_NAME_KEY: string = 'volume_vm_name';
  private vm_names: ***REMOVED***[key: string]: string***REMOVED*** = ***REMOVED******REMOVED***;

  async navigateToOverview(): Promise<any> ***REMOVED***
    console.log('Navigating to VM Overview Page')
    await Util.navigateToAngularPage(this.VM_OVERVIEW_URL);

    return await Util.waitForPage(this.VM_OVERVIEW_URL);
  ***REMOVED***

  async setBasicVMName(name: string): Promise<any> ***REMOVED***
    console.log(`Setting basic vm name as $***REMOVED***name***REMOVED***`);
    this.vm_names[this.BASIC_VM_NAME_KEY] = name;
  ***REMOVED***

  async setVolumeVMName(name: string): Promise<any> ***REMOVED***
    console.log(`Setting volume vm name as $***REMOVED***name***REMOVED***`);
    this.vm_names[this.VOLUME_VM_NAME_KEY] = name;
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
      .element(by.id(this.ACTIVE_BADGE)));

    return await element(by.id(this.TABLE_ID)).element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`)).element(by.id(this.ACTIVE_BADGE)).isPresent();
  ***REMOVED***

  async isBasicVMActive(): Promise<boolean> ***REMOVED***
    return await this.isVmActive(this.vm_names[this.BASIC_VM_NAME_KEY]);
  ***REMOVED***

  async areAllVMActive(): Promise<boolean> ***REMOVED***
    console.log('Checking every vm if active');
    for (const key in this.vm_names) ***REMOVED***
      const val = this.vm_names[key];
      console.log(`Key: $***REMOVED***key***REMOVED*** Value: $***REMOVED***val***REMOVED***`);
      if (await !this.isVmActive(val)) ***REMOVED***
        return false;
      ***REMOVED***
    ***REMOVED***

    return true;
  ***REMOVED***

  async isVMShutoff(name: string): Promise<boolean> ***REMOVED***
    console.log(`Checking if $***REMOVED***name***REMOVED*** is shutoff`);
    await element(by.id(this.TABLE_ID)).element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`)).element(by.id(this.SHUTOFF_BADGE));

    return await element(by.id(this.TABLE_ID)).element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`)).element(by.id(this.SHUTOFF_BADGE))
      .isPresent();
  ***REMOVED***

  async isBasicVMShutoff(): Promise<boolean> ***REMOVED***
    return await this.isVMShutoff(this.vm_names[this.BASIC_VM_NAME_KEY]);
  ***REMOVED***

  async isVMDeleted(name: string): Promise<boolean> ***REMOVED***
    console.log(`Checking if $***REMOVED***name***REMOVED*** is deleted`);

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
    await Util.waitForPresenceByElement(element(by.id(this.TABLE_ID)).element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`))
                                          .element(by.id(this.SELECT_BUTTON)));
    await element(by.id(this.TABLE_ID)).element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`)).element(by.id(this.SELECT_BUTTON)).click();
  ***REMOVED***

  async shutoffVM(name: string): Promise<any> ***REMOVED***
    console.log(`Shutting off $***REMOVED***name***REMOVED***`);
    await this.clickSelectDropdown(name);
    await element(by.id(this.TABLE_ID)).element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`)).element(by.id(this.SHUTOFF_BUTTON)).click();
    await Util.waitForPresenceByElement(
      element(by.id(this.STOP_MODAL)).element(by.id(this.SHUTOFF_SUCCESS)),
      420000
    );
    await Util.waitForPresenceByElement(element(by.id(this.STOP_MODAL)).element(by.id(this.CLOSE_STOP_MODAL)));
    await element(by.id(this.STOP_MODAL)).element(by.id(this.CLOSE_STOP_MODAL)).click();
  ***REMOVED***

  async shutOffBasicVM(): Promise<any> ***REMOVED***
    return await this.shutoffVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  ***REMOVED***

  async resumeVM(name: string): Promise<any> ***REMOVED***
    console.log(`Resuming $***REMOVED***name***REMOVED***`);
    await this.clickSelectDropdown(name);
    await element(by.id(this.TABLE_ID)).element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`)).element(by.id(this.RESUME_BUTTON)).click();
    await Util.waitForPresenceByElement(
      element(by.id(this.RESUME_MODAL)).element(by.id(this.RESUME_SUCCESS)),
      420000
    );
    await element(by.id(this.RESUME_MODAL)).element(by.id(this.CLOSE_RESUME_MODAL)).click();
  ***REMOVED***

  async resumeBasicVM(): Promise<any> ***REMOVED***
    return await this.resumeVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  ***REMOVED***

  async deleteVM(name: string): Promise<any> ***REMOVED***
    console.log(`Deleting $***REMOVED***name***REMOVED***`);
    await this.clickSelectDropdown(name);
    await element(by.id(this.TABLE_ID)).element(by.id(`$***REMOVED***this.ROW_PREFIX***REMOVED***$***REMOVED***name***REMOVED***`)).element(by.id(this.DELETE_BUTTON)).click();
    await Util.waitForPresenceOfElementById(this.VERIFY_MODAL);
    await element(by.id(this.VERIFY_MODAL)).element(by.id(this.CONFIRM_DELETE_BUTTON)).click();
    await Util.waitForPresenceByElement(
      element(by.id(this.DELETE_MODAL)).element(by.id(this.DELETE_SUCCESS)),
      420000
    );
    await element(by.id(this.DELETE_MODAL)).element(by.id(this.CLOSE_DELETE_MODAL)).click();
  ***REMOVED***

  async deleteBasicVM(): Promise<any> ***REMOVED***
    return await this.deleteVM(this.vm_names[this.BASIC_VM_NAME_KEY]);
  ***REMOVED***

  async deleteVolumeVM(): Promise<any> ***REMOVED***
    return await this.deleteVM(this.vm_names[this.VOLUME_VM_NAME_KEY]);
  ***REMOVED***
***REMOVED***
