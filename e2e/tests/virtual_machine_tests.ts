import {browser} from 'protractor';
import {NewInstancePage} from '../page_objects/new_instance.po';
import {LoginPage} from '../page_objects/login.po';
import {VolumeOverviewPage} from '../page_objects/volume_overview.po';
import {VMOverviewPage} from '../page_objects/vm_overview.po';
import {SnapshotOverviewPage} from '../page_objects/vm_snapshot.po';

describe('Virtual Machine Tests', async function (): Promise<any> {

  const vmOverviewPage: VMOverviewPage = new VMOverviewPage();

  beforeAll(async function (): Promise<any> {
    console.log('------------------------------All virtual machine tests: started');
    await browser.waitForAngularEnabled(false);
    await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
  });

  it('should start a basic vm', async function (): Promise<any> {
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
  });

  it('should start a basic vm with a volume', async function (): Promise<any> {
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
  });

  it('should show all virtual machines as active', async function (): Promise<any> {
    console.log('------------------------------Overview virtual machine tests: started');
    await vmOverviewPage.navigateToOverview();
    console.log('Checking if every VM is active');
    const areActive: boolean = await vmOverviewPage.areAllVMActive();
    expect(areActive).toBeTruthy();
  });

  it('should shutdown the basic vm', async function (): Promise<any> {
    console.log('Shutting down the basic vm');
    await vmOverviewPage.shutOffBasicVM();
    const isShutoff: boolean = await vmOverviewPage.isBasicVMShutoff();
    expect(isShutoff).toBeTruthy();
  });

  it('should resume the basic vm', async function (): Promise<any> {
    console.log('Resuming the basic vm');
    await vmOverviewPage.resumeBasicVM();
    const isActive: boolean = await vmOverviewPage.isBasicVMActive();
    expect(isActive).toBeTruthy();
  });

  it('should delete the volume vm without deleting the volume', async function (): Promise<any> {
    console.log('Deleting the volume vm');
    await vmOverviewPage.deleteVolumeVM();
    await VolumeOverviewPage.navigateToVolumeOverview();
    const isVolumePresent: boolean = await VolumeOverviewPage.isVolumePresent();
    expect(isVolumePresent).toBeTruthy();
  });

  it('should delete the vm created volume', async function (): Promise<any> {
    console.log('Deleting the volume created in new instance tab');
    await VolumeOverviewPage.deleteVolume();
    const deleted: boolean = await VolumeOverviewPage.isVolumeDeleted();
    expect(deleted).toBeTruthy();
  });

  it('should create a snapshot of the basic vm', async function (): Promise<any> {
    console.log('Creating a snapshot of the basic vm');
    await vmOverviewPage.navigateToOverview();
    await vmOverviewPage.createSnapshotOfBasicVM();
    await SnapshotOverviewPage.navigateToSnapshotOverview();
    const isPresent: boolean = await SnapshotOverviewPage.isBasicSnapshotPresent();
    const isActive: boolean = await SnapshotOverviewPage.isBasicSnapshotActive();
    expect(isPresent && isActive).toBeTruthy();
  });

  it('should delete the snapshot of the basic vm', async function (): Promise<any> {
    console.log('Deleting the snapshot of the basic vm');
    await SnapshotOverviewPage.deleteBasicSnapshot();
    const isDeleted: boolean = await SnapshotOverviewPage.isBasicSnapshotDeleted();
    expect(isDeleted).toBeTruthy();
  });

  it('should create and attach a volume to basic vm', async function (): Promise<any> {
    console.log('Creating and attaching a volume to basic vm');
    await VolumeOverviewPage.navigateToVolumeOverview();
    await VolumeOverviewPage.createAndAttachVolumeToProjectVm(await vmOverviewPage.getBasicVMName());
    const present: boolean = await VolumeOverviewPage.isVolumePresent();
    const attached: boolean = await VolumeOverviewPage.isVolumeAttachedToVM(await vmOverviewPage.getBasicVMName());
    expect(present && attached).toBeTruthy();
  });

  it('should should delete the basic vm without deleting the volume', async function (): Promise<any> {
    console.log('Deleting the volume vm');
    await vmOverviewPage.navigateToOverview();
    await vmOverviewPage.deleteBasicVM();
    await VolumeOverviewPage.navigateToVolumeOverview();
    const isVolumePresent: boolean = await VolumeOverviewPage.isVolumePresent();
    const notAttached: boolean = await VolumeOverviewPage.isVolumeFree();
    expect(isVolumePresent && notAttached).toBeTruthy();
  });

  it('should delete the manually created volume', async function (): Promise<any> {
    console.log('Deleting the volume created by attachment');
    await VolumeOverviewPage.navigateToVolumeOverview();
    await VolumeOverviewPage.deleteVolume();
    const deleted: boolean = await VolumeOverviewPage.isVolumeDeleted();
    expect(deleted).toBeTruthy();
  });

});
