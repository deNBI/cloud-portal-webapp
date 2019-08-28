import ***REMOVED***by, element***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from '../util';

export class VolumeOverviewPage ***REMOVED***

  private static VOLUME_OVERVIEW_URL: string = 'virtualmachines/volumeOverview';
  private static TABLE_ID: string = 'volume_table_body';
  private static VOLUME_NAME_CELL_ID_PREFIX: string = 'cell_name_id_';
  private static VOLUME_NAME: string = 'ProtractorVolume';

  static async navigateToVolumeOverview(): Promise<any> ***REMOVED***
    console.log('Navigating to volume overview');
    await Util.navigateToAngularPage(this.VOLUME_OVERVIEW_URL);
  ***REMOVED***

  static async isVolumePresent(): Promise<boolean> ***REMOVED***
    await Util.waitForPresenceByElement(element(by.id(this.TABLE_ID))
                                          .element(by.id(`$***REMOVED***this.VOLUME_NAME_CELL_ID_PREFIX***REMOVED***$***REMOVED***this.VOLUME_NAME***REMOVED***`)));

    return await element(by.id(this.TABLE_ID)).element(by.id(`$***REMOVED***this.VOLUME_NAME_CELL_ID_PREFIX***REMOVED***$***REMOVED***this.VOLUME_NAME***REMOVED***`)).isPresent();
  ***REMOVED***
***REMOVED***
