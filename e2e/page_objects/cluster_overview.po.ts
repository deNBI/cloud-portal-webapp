import {browser} from 'protractor';
import {Util} from '../util';

/**
 * Cluster Overview Page.
 */
export class ClusterOverviewPage {

  private CLUSTER_OVERVIEW_URL: string = 'virtualmachines/clusterOverview';
  private INSTANCE_PREFIX: string = 'instanceCard_'
  private RUNNING_BADE_PREFIX: string = 'running_badge_'
  private DELETE_CLUSTER_PREFIX: string = 'delete_'
  private SCALE_DOWN_PREFIX: string = 'scale_down_'
  private SCALE_UP_PREFIX: string = 'scale_up_'
  private CONFIRM_DELETE_BTN: string = 'confirm_delete_button'
  private DEFAULT_BADGE_PREFIX: string = 'default_badge_'

  async navigateToOverview(): Promise<any> {
    Util.logInfo('Navigating to Cluster Overview Page');
    await Util.navigateToAngularPage(this.CLUSTER_OVERVIEW_URL);
    await Util.waitForPage(this.CLUSTER_OVERVIEW_URL, Util.MIN_TIMEOUT_1);

    return await browser.driver.sleep(10000);
  }

  async isClusterActive(name: string): Promise<boolean> {
    Util.logInfo(`Checking if ${name} is active`);
    await Util.waitForPresenceOfElementById(this.INSTANCE_PREFIX + name);

    return await Util.waitForPresenceOfElementById(`${this.RUNNING_BADE_PREFIX}${name}`, Util.MIN_TIMOEUT_30);
  }

  async scaleUpCluster(name: string): Promise<any> {
    Util.logInfo(`Scale Up ${name}`);

    await Util.clickElementById(this.SCALE_UP_PREFIX + name)

    Util.logInfo(`Deletion method for ${name} completed`)
  }

  async deleteCluster(name: string): Promise<any> {
    Util.logInfo(`Deleting ${name}`);

    await Util.clickElementById(this.DELETE_CLUSTER_PREFIX + name)

    await Util.clickElementById(this.CONFIRM_DELETE_BTN);
    await Util.waitForPresenceOfElementById(this.DEFAULT_BADGE_PREFIX + name);

    Util.logInfo(`Deletion method for ${name} completed`)
  }


}
