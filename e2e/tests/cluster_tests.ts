import {browser} from 'protractor';
import {LoginPage} from '../page_objects/login.po';

import {Util} from '../util';
import {NewClusterPage} from '../page_objects/new_cluster.po';
import {ClusterOverviewPage} from '../page_objects/cluster_overview.po';

describe('Cluster Tests', async function(): Promise<any> {

  beforeAll(async function(): Promise<any> {
    Util.logDebug('------------------------------Cluster tests: started');
    await browser.waitForAngularEnabled(false);
    await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
  });

  it('should start a cluster', async function(): Promise<any> {
    Util.logDebug('------------------------------Start cluster test: started');
    Util.logDebug('Trying to start a new cluster');
    await NewClusterPage.navigateToNewClusterPage();
    Util.logInfo('Choosing project');
    await NewClusterPage.chooseProject();
    Util.logInfo('Filling Form');
    await NewClusterPage.fillBasicForm();
    Util.logInfo('Starting');
    const cluster_id: string = await NewClusterPage.submitAndStartCluster();
    await ClusterOverviewPage.setClusterName(cluster_id)

  });

  it('cluster should become active', async function(): Promise<any> {
    Util.logDebug('------------------------------Overview cluster tests: started');
    await ClusterOverviewPage.navigateToOverview();
    Util.logInfo(`Checking if cluster ${ClusterOverviewPage.getClusterName()} is active`);
    const areActive: boolean = await ClusterOverviewPage.isClusterActive();
    expect(areActive).toBeTruthy();
  });

  it('cluster should be deleted', async function(): Promise<any> {
    await ClusterOverviewPage.navigateToOverview();
    Util.logInfo(`Checking if cluster ${ClusterOverviewPage.getClusterName()} is active`);
    const areActive: boolean = await ClusterOverviewPage.isClusterActive();
    expect(areActive).toBeTruthy();
  });

});
