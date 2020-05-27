import {browser} from 'protractor';
import {NewInstancePage} from '../page_objects/new_instance.po';
import {LoginPage} from '../page_objects/login.po';
import {VolumeOverviewPage} from '../page_objects/volume_overview.po';
import {VMOverviewPage} from '../page_objects/vm_overview.po';
import {SnapshotOverviewPage} from '../page_objects/vm_snapshot.po';
import {VMDetailPage} from '../page_objects/vm_detail.po';
import {Util} from '../util';

describe('Virtual Machine Tests', async function (): Promise<any> {

  const vmOverviewPage: VMOverviewPage = new VMOverviewPage();
  const vmDetailPage: VMDetailPage = new VMDetailPage();

  beforeAll(async function (): Promise<any> {
     Util.logHeader('------------------------------All virtual machine tests: started');
     await browser.waitForAngularEnabled(false);
     await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
  });

  it('should start a basic vm', async function (): Promise<any> {
    Util.logHeader('------------------------------Start virtual machine tests: started');
    Util.logHeader('Trying to start a vm with denbi default and Ubuntu 18.04.');
    await NewInstancePage.getNewInstanceTab();
    Util.logInfo('Choosing project');
    await NewInstancePage.chooseProject();
    Util.logInfo('Filling Form');
    await NewInstancePage.fillBasicForm();
    Util.logInfo('Starting');
    await NewInstancePage.submitAndStartVM();
    Util.logInfo('Redirect Modal should be present');
    await NewInstancePage.isRedirectModalPresent();
    await Util.waitForPage('/virtualmachines/vmOverview', Util.LONG_TIMEOUT)

    Util.logInfo('Saving basic vm name');
    const vm_name: string = await vmOverviewPage.getNewBasicVMName();
    Util.logInfo(vm_name);
    await vmOverviewPage.setBasicVMName(vm_name);
  });

  it('should start a basic vm with a volume', async function (): Promise<any> {
    Util.logHeader('Trying to start a vm with denbi default and Ubuntu 18.04 and a volume');
    await NewInstancePage.getNewInstanceTab();
    Util.logInfo('Choosing project');
    await NewInstancePage.chooseProject();
    Util.logInfo('Filling Form');
    await NewInstancePage.fillBasicVolumeForm();
    Util.logInfo('Setting Volume');
    await NewInstancePage.setVolume();
    Util.logInfo('Starting');
    await NewInstancePage.submitAndStartVM();
    Util.logInfo('Redirect Modal should be present');
    await NewInstancePage.isRedirectModalPresent();
    const vm_name: string = await vmOverviewPage.getNewVolumeVMName();
    Util.logInfo(vm_name);

    await vmOverviewPage.setVolumeVMName(vm_name);
    browser.sleep(8000).then().catch();

    Util.logInfo('Checking volume overview if volume present');
    await VolumeOverviewPage.navigateToVolumeOverview();
    browser.sleep(8000).then().catch();
    const isVolumePresent: boolean = await VolumeOverviewPage.isVolumePresent();
    expect(isVolumePresent).toBeTruthy();
    Util.logInfo('------------------------------Start virtual machine tests: ended');
  });

  it('should show all virtual machines as active', async function (): Promise<any> {
    Util.logHeader('------------------------------Overview virtual machine tests: started');
    await vmOverviewPage.navigateToOverview();
    Util.logInfo('Checking if every VM is active');
    const areActive: boolean = await vmOverviewPage.areAllVMActive();
    expect(areActive).toBeTruthy();
  });

  it('should shutdown the basic vm', async function (): Promise<any> {
    Util.logHeader('Shutting down the basic vm');
    await vmOverviewPage.shutOffBasicVM();
    const isShutoff: boolean = await vmOverviewPage.isBasicVMShutoff();
    expect(isShutoff).toBeTruthy();
  });

  it('should resume the basic vm', async function (): Promise<any> {
    Util.logHeader('Resuming the basic vm');
    await vmOverviewPage.resumeBasicVM();
    const isActive: boolean = await vmOverviewPage.isBasicVMActive();
    expect(isActive).toBeTruthy();
  });

  it('should delete the volume vm without deleting the volume', async function (): Promise<any> {
    Util.logHeader('Deleting the volume vm');
    await vmOverviewPage.deleteVolumeVM();
    await VolumeOverviewPage.navigateToVolumeOverview();
    const isVolumePresent: boolean = await VolumeOverviewPage.isVolumePresent();
    expect(isVolumePresent).toBeTruthy();
  });

  it('should delete the vm created volume', async function (): Promise<any> {
    Util.logHeader('Deleting the volume created in new instance tab');
    await VolumeOverviewPage.deleteVolume();
    const deleted: boolean = await VolumeOverviewPage.isVolumeDeleted();
    expect(deleted).toBeTruthy();
  });

  it('should create a snapshot of the basic vm', async function (): Promise<any> {
    Util.logHeader('Creating a snapshot of the basic vm');
    await vmOverviewPage.navigateToOverview();
    await vmOverviewPage.createSnapshotOfBasicVM();
    await SnapshotOverviewPage.navigateToSnapshotOverview();
    const isPresent: boolean = await SnapshotOverviewPage.isBasicSnapshotPresent();
    const isActive: boolean = await SnapshotOverviewPage.isBasicSnapshotActive();
    expect(isPresent && isActive).toBeTruthy();
  });
  it('should start  a  vm with the  snapshot', async function (): Promise<any> {
    Util.logHeader('Trying to start a vm with snapshot and Ubuntu 18.04 and a volume');
    await NewInstancePage.getNewInstanceTab();
    Util.logInfo('Choosing project');
    await NewInstancePage.chooseProject();
    Util.logInfo('Filling Form');
    await NewInstancePage.fillBasicForm(Util.BASIC_SNAPSHOT_NAME);

    Util.logInfo('Starting');
    await NewInstancePage.submitAndStartVM();
    await Util.waitForPage('/virtualmachines/vmOverview');

    Util.logInfo('------------------------------Start virtual machine with snapshot ended');
  });

  it('should create and attach a volume to basic vm', async function (): Promise<any> {
    Util.logHeader('Creating and attaching a volume to basic vm');
    await VolumeOverviewPage.navigateToVolumeOverview();
    await VolumeOverviewPage.createAndAttachVolumeToProjectVm(await vmOverviewPage.getBasicVMName());
    const present: boolean = await VolumeOverviewPage.isVolumePresent();
    const attached: boolean = await VolumeOverviewPage.isVolumeAttachedToVM(await vmOverviewPage.getBasicVMName());
    expect(present && attached).toBeTruthy();
  });

  it('should delete the snapshot of the basic vm', async function (): Promise<any> {
    Util.logHeader('Deleting the snapshot of the basic vm');
    await SnapshotOverviewPage.navigateToSnapshotOverview();
    await SnapshotOverviewPage.deleteBasicSnapshot();
    const isDeleted: boolean = await SnapshotOverviewPage.isBasicSnapshotDeleted();
    expect(isDeleted).toBeTruthy();
  });

  it('should should delete the basic vm without deleting the volume', async function (): Promise<any> {
    Util.logHeader('Deleting the volume vm');
    await vmOverviewPage.navigateToOverview();
    await vmOverviewPage.deleteBasicVM();
    await VolumeOverviewPage.navigateToVolumeOverview();
    const isVolumePresent: boolean = await VolumeOverviewPage.isVolumePresent();
    const notAttached: boolean = await VolumeOverviewPage.isVolumeFree();
    expect(isVolumePresent && notAttached).toBeTruthy();
  });

  it('should delete the manually created volume', async function (): Promise<any> {
    Util.logHeader('Deleting the volume created by attachment');
    await VolumeOverviewPage.navigateToVolumeOverview();
    await VolumeOverviewPage.deleteVolume();
    const deleted: boolean = await VolumeOverviewPage.isVolumeDeleted();
    expect(deleted).toBeTruthy();
  });

  it('should start a new vm', async function (): Promise<any> {
    Util.logHeader('Starting new machine for VM Detail page');
    Util.logHeader('Trying to start a new vm with denbi default and Ubuntu 18.04.');
    await NewInstancePage.getNewInstanceTab();
    Util.logInfo('Choosing project');
    await NewInstancePage.chooseProject();
    Util.logInfo('Filling Form');
    await NewInstancePage.fillBasicForm();
    Util.logInfo('Starting');
    await NewInstancePage.submitAndStartVM();
    Util.logInfo('Saving basic vm name');
    const vm_name: string = await NewInstancePage.getVMName();
    Util.logInfo(vm_name);
    await vmOverviewPage.setBasicVMName(vm_name);
    await Util.waitForPage('/virtualmachines/vmOverview')
  });

  it('should show vm detail page with base functions for virtual machines working',
     async function (): Promise<any> {
       Util.logHeader('showing instance detail page');
       await vmOverviewPage.navigateToOverview();
       await vmOverviewPage.goToVmDetail();
    // TODO: test stop, restart and other basic functions of virtual machines on the vmDetailPage
       await vmDetailPage.setBasicVMName((await vmOverviewPage.getBasicVMName()));
       await vmDetailPage.stopBasicVM();
       await vmDetailPage.restartBasicVM();
       await vmDetailPage.createSnapshotBasicVM();
       await vmDetailPage.deleteBasicVM();
  });

});
