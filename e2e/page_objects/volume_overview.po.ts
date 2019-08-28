import {by, element} from 'protractor';
import {Util} from '../util';

export class VolumeOverviewPage {

  private static VOLUME_OVERVIEW_URL: string = 'virtualmachines/volumeOverview';
  private static TABLE_ID: string = 'volume_table_body';
  private static VOLUME_NAME_CELL_ID_PREFIX: string = 'cell_name_id_';
  private static VOLUME_NAME: string = 'ProtractorVolume';

  static async navigateToVolumeOverview(): Promise<any> {
    console.log('Navigating to volume overview');
    await Util.navigateToAngularPage(this.VOLUME_OVERVIEW_URL);
  }

  static async isVolumePresent(): Promise<boolean> {
    await Util.waitForPresenceByElement(element(by.id(this.TABLE_ID))
                                          .element(by.id(`${this.VOLUME_NAME_CELL_ID_PREFIX}${this.VOLUME_NAME}`)));

    return await element(by.id(this.TABLE_ID)).element(by.id(`${this.VOLUME_NAME_CELL_ID_PREFIX}${this.VOLUME_NAME}`)).isPresent();
  }
}
