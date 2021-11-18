import { browser } from 'protractor';
import { Util } from '../util';

/**
 * Cluster Overview Page.
 */
export class ClusterOverviewPage {

	private static CLUSTER_OVERVIEW_URL: string = 'virtualmachines/clusterOverview';
	private static INSTANCE_PREFIX: string = 'instanceCard_';
	private static RUNNING_BADE_PREFIX: string = 'running_badge_';
	private static DELETE_CLUSTER_PREFIX: string = 'delete_';
	private static SCALE_DOWN_PREFIX: string = 'scale_down_';
	private static SCALE_UP_PREFIX: string = 'scale_up_';
	private static CONFIRM_DELETE_BTN: string = 'confirm_delete_button';
	private static DEFAULT_BADGE_PREFIX: string = 'default_badge_';
	private static DELETE_BADGE_PREFIX: string = 'deleted_badge_';
	private static CLUSTER_NAME: string = '';

	static async setClusterName(name: string): Promise<any> {
		Util.logInfo(`Setting basic cluster name as ${name}`);
		this.CLUSTER_NAME = name;
	}

	static async getClusterName(): Promise<any> {
		return this.CLUSTER_NAME;
	}

	static async navigateToOverview(): Promise<any> {
		Util.logInfo('Navigating to Cluster Overview Page');
		await Util.navigateToAngularPage(this.CLUSTER_OVERVIEW_URL);
		await Util.waitForPage(this.CLUSTER_OVERVIEW_URL, Util.MIN_TIMEOUT_1);

		return await browser.driver.sleep(10000);
	}

	static async isClusterActive(name: string = this.CLUSTER_NAME): Promise<boolean> {
		Util.logInfo(`Checking if ${name} is active`);

		return await Util.waitForPresenceOfElementById(`${this.RUNNING_BADE_PREFIX}${name}`, Util.MIN_TIMOEUT_30);
	}

	static async scaleUpCluster(name: string = this.CLUSTER_NAME): Promise<any> {
		Util.logInfo(`Scale Up ${name}`);

		await Util.clickElementById(this.SCALE_UP_PREFIX + name);

		Util.logInfo(`Deletion method for ${name} completed`);
	}

	static async deleteCluster(name: string = this.CLUSTER_NAME): Promise<any> {
		Util.logInfo(`Deleting ${name}`);

		await Util.clickElementById(this.DELETE_CLUSTER_PREFIX + name);

		await Util.clickElementById(this.CONFIRM_DELETE_BTN);
		await Util.waitForPresenceOfElementById(this.DELETE_BADGE_PREFIX + name, Util.MIN_TIMEOUT_15);

		Util.logInfo(`Deletion method for ${name} completed`);
	}

}
