import {browser} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {VMOverviewPage} from '../page_objects/vm_overview.po';
import {VMDetailPage} from '../page_objects/vm_detail.po';
import {Util} from '../util';
import {NewClusterPage} from '../page_objects/new_cluster.po';

describe('Virtual Machine Tests', async function (): Promise<any> {

  const vmOverviewPage: VMOverviewPage = new VMOverviewPage();
  const vmDetailPage: VMDetailPage = new VMDetailPage();

  beforeAll(async function (): Promise<any> {
    Util.logDebug('------------------------------Cluster tests: started');
    await browser.waitForAngularEnabled(false);
    await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
  });

  it('should start a cluster', async function (): Promise<any> {
    Util.logDebug('------------------------------Start virtual machine tests: started');
    Util.logDebug('Trying to start a vm with denbi default and Ubuntu 18.04.');
    await NewClusterPage.navigateToNewClusterPage();
    Util.logInfo('Choosing project');
    await NewClusterPage.chooseProject();
    Util.logInfo('Filling Form');
    await NewClusterPage.fillBasicForm();
    Util.logInfo('Starting');
    const cluster_id: string = await NewClusterPage.submitAndStartCluster();

  });

  it('should show all virtual machines as active', async function (): Promise<any> {
    Util.logDebug('------------------------------Overview virtual machine tests: started');
    await vmOverviewPage.navigateToOverview();
    Util.logInfo('Checking if every VM is active');
    const areActive: boolean = await vmOverviewPage.areAllVMActive();
    expect(areActive).toBeTruthy();
  });

});
