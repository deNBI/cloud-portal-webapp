import {browser} from 'protractor';
import {Util} from '../util';

/**
 * Snapshot Overview page.
 */
export class SnapshotOverviewPage {

  private static SNAPSHOT_OVERVIEW_URL: string = 'virtualmachines/snapshotOverview';
  private static TABLE_ID: string = 'snapshot_table';
  private static SNAPSHOT_ACTIVE_PREFIX: string = 'snapshot_active_';
  private static DELETE_BUTTON_PREFIX: string = 'delete_button_';
  private static DELETE_MODAL: string = 'delete_modal';
  private static DELETE_SUCCESS: string = 'delete_success';
  private static CLOSE_DELETE_MODAL: string = 'close_delete_modal';
  private static VERIFY_MODAL: string = 'verify_modal';
  private static CONFIRM_DELETE: string = 'confirm_delete_button';

  static async navigateToSnapshotOverview(): Promise<any> {
    Util.logInfo('Navigating to Snapshot Overview Page');
    await Util.navigateToAngularPage(this.SNAPSHOT_OVERVIEW_URL);
    await Util.waitForPage(this.SNAPSHOT_OVERVIEW_URL);

    return await browser.driver.sleep(10000);
  }

  static async isSnapshotDeleted(name: string): Promise<boolean> {
    Util.logInfo(`Checking if snapshot ${name} is absent`);
    await Util.waitForPresenceOfElementById(this.TABLE_ID, 10000);

    return await Util.waitForAbsenceOfElementById(name);
  }

  static async isBasicSnapshotDeleted(): Promise<boolean> {
    return await this.isSnapshotDeleted(Util.BASIC_SNAPSHOT_NAME);
  }

  static async isSnapshotPresent(name: string): Promise<boolean> {
    Util.logInfo(`Checking if snapshot ${name} is present`);
    await Util.waitForPresenceOfElementById(this.TABLE_ID, 10000);

    return await Util.waitForPresenceOfElementById(name);
  }

  static async isBasicSnapshotPresent(): Promise<boolean> {
    return await this.isSnapshotPresent(Util.BASIC_SNAPSHOT_NAME);
  }

  static async isSnapshotActive(name: string): Promise<boolean> {
    Util.logInfo(`Checking if snapshot ${name} is active`);
    await Util.waitForPresenceOfElementById(this.TABLE_ID, 1000000);

    return await Util.waitForPresenceOfElementById(`${this.SNAPSHOT_ACTIVE_PREFIX}${name}`, Util.MIN_TIMEOUT_15);
  }

  static async isBasicSnapshotActive(): Promise<boolean> {
    return await this.isSnapshotActive(Util.BASIC_SNAPSHOT_NAME);
  }

  static async deleteSnapshot(name: string): Promise<any> {
    Util.logInfo(`Deleting snapshot ${name}`);
    await Util.waitForPresenceOfElementById(this.TABLE_ID);
    await Util.clickElementById(`${this.DELETE_BUTTON_PREFIX}${name}`);
    await Util.waitForPresenceOfElementById(this.VERIFY_MODAL);
    await Util.clickElementById(this.CONFIRM_DELETE);
    await Util.waitForPresenceOfElementById(this.DELETE_MODAL);
    await Util.waitForPresenceOfElementById(this.DELETE_SUCCESS);
    await Util.clickElementById(this.CLOSE_DELETE_MODAL);

    return await Util.waitForInvisibilityOfElementById(this.DELETE_MODAL);
  }

  static async deleteBasicSnapshot(): Promise<any> {
    await this.deleteSnapshot(Util.BASIC_SNAPSHOT_NAME);
  }
}
