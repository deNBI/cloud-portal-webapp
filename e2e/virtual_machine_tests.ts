import ***REMOVED***browser***REMOVED*** from 'protractor';
import ***REMOVED***NewInstancePage***REMOVED*** from './page_objects/new_instance.po';
import ***REMOVED***LoginPage***REMOVED*** from './page_objects/login.po';
import ***REMOVED***VolumeOverviewPage***REMOVED*** from './page_objects/volume_overview.po';
import ***REMOVED***VMOverviewPage***REMOVED*** from './page_objects/vm_overview.po';

describe('Virtual Machine Tests', async function () ***REMOVED***

  const vmOverviewPage: VMOverviewPage = new VMOverviewPage();

  beforeAll(async function () ***REMOVED***
    console.log('------------------------------All virtual machine tests: started');
    browser.waitForAngularEnabled(false);
    await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user);
  ***REMOVED***);

  it('should start a basic vm', async function () ***REMOVED***
    console.log('------------------------------Start virtual machine tests: started');
    console.log('Trying to start a vm with denbi default and Ubuntu 18.04.');
    await NewInstancePage.getNewInstanceTab();
    console.log('Choosing project');
    await NewInstancePage.chooseProject();
    console.log('Filling Form');
    await NewInstancePage.fillBasicForm();
    console.log('Starting');
    await NewInstancePage.submitAndStartVM();
    console.log('Waiting for confirmation');
    const isPresent: boolean = await NewInstancePage.waitForConfirmation();
    expect(isPresent).toBeTruthy();
    console.log('Saving basic vm name');
    const vm_name: string = await NewInstancePage.getVMName();
    await vmOverviewPage.setBasicVMName(vm_name);
    await NewInstancePage.closeInfoModal();
  ***REMOVED***);

  it('should start a basic vm with a volume', async function () ***REMOVED***
    console.log('Trying to start a vm with denbi default and Ubuntu 18.04 and a volume');
    await NewInstancePage.getNewInstanceTab();
    console.log('Choosing project');
    await NewInstancePage.chooseProject();
    console.log('Filling Form');
    await NewInstancePage.fillBasicVolumeForm();
    console.log('Setting Volume');
    await NewInstancePage.setVolume();
    console.log('Starting');
    await NewInstancePage.submitAndStartVM();
    console.log('Waiting for confirmation');
    const isVMPresent: boolean = await NewInstancePage.waitForConfirmation();
    expect(isVMPresent).toBeTruthy();
    const vm_name: string = await NewInstancePage.getVMName();
    await vmOverviewPage.setVolumeVMName(vm_name);
    await NewInstancePage.closeInfoModal();
    console.log('Checking volume overview if volume present');
    await VolumeOverviewPage.navigateToVolumeOverview();
    const isVolumePresent: boolean = await VolumeOverviewPage.isVolumePresent();
    expect(isVolumePresent).toBeTruthy();
    console.log('------------------------------Start virtual machine tests: ended');
  ***REMOVED***);

  it('should show both virtual machines as active', async function () ***REMOVED***
    console.log('------------------------------Overview virtual machine tests: started');
    await vmOverviewPage.navigateToOverview();
    console.log('Checking if every VM is active');
    const areActive: boolean = await vmOverviewPage.areAllVMActive();
    expect(areActive).toBeTruthy();
  ***REMOVED***);

  it('should shutdown the basic vm', async function () ***REMOVED***
    console.log('Shutting down the basic vm');
    await vmOverviewPage.shutOffBasicVM();
    const isShutoff: boolean = await vmOverviewPage.isBasicVMShutoff();
    expect(isShutoff).toBeTruthy();
  ***REMOVED***);

  it('should resume the basic vm', async function () ***REMOVED***
    console.log('Resuming the basic vm');
    await vmOverviewPage.resumeBasicVM();
    const isActive: boolean = await vmOverviewPage.isBasicVMActive();
    expect(isActive).toBeTruthy();
  ***REMOVED***);
  /*
  it('should create a snapshot of the basic vm', async function () ***REMOVED***
    console.log('Creating a snapshot of the basic vm');
    await vmOverviewPage.createBasicVMSnapshot();
    const isSnapshot: boolean = await SnapshotPage.isSnapshot();
    expect(isSnapshot).toBeTruthy();
  ***REMOVED***);
  */
  it('should delete the basic vm', async function () ***REMOVED***
    console.log('Deleting the basic vm');
    await vmOverviewPage.deleteBasicVM();
    const deleted: boolean = await vmOverviewPage.isBasicVMDeleted();
    expect(deleted).toBeTruthy();
  ***REMOVED***);

  it('should should delete the volume vm without deleting the volume', async function () ***REMOVED***
    console.log('Deleting the volume vm');
    const deleted: boolean = await vmOverviewPage.deleteVolumeVM();
    expect(deleted).toBeTruthy();
    await VolumeOverviewPage.navigateToVolumeOverview();
    const isVolumePresent: boolean = await VolumeOverviewPage.isVolumePresent();
    expect(isVolumePresent).toBeTruthy();
    console.log('------------------------------Overview virtual machine tests: ended');
  ***REMOVED***);

***REMOVED***);
