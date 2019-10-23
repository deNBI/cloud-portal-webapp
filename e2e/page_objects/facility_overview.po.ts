import {by, element} from 'protractor';
import {Util} from '../util';

/**
 * Facilityoverivew page.
 */
export class FacilityOverviewPage {

    private static FACILITY_OVERVIEW_URL: string = 'facility-manager/facilityApplications';
    private static APPLICATION_APPROVAL_BTN_PREFIX: string = 'approval_';
    private static SUCCESSFULLY_APPROVED_APPL: string = 'Successfully approved the application.';
    private static NOTIFICATION_MESSAGE: string = 'notification_message';
    private static EXTENSION_APPROVAL_BTN_PREFIX: string = 'extension_approval_';
    private static EXTENSION_SUCCESSFULLY: string = 'Successfully approved the application modification.';

    static async navigateToFacilityOverview(): Promise<any> {
        console.log('Navigating to facility overview');
        await Util.navigateToAngularPage(this.FACILITY_OVERVIEW_URL);
    }

    static async approveApplication(application_name: string): Promise<any> {
        await Util.clickElementById(this.APPLICATION_APPROVAL_BTN_PREFIX + application_name);
        await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.SUCCESSFULLY_APPROVED_APPL);
    }

    static async approveApplicationExtension(application_name: string): Promise<any> {
        await Util.clickElementById(this.EXTENSION_APPROVAL_BTN_PREFIX + application_name);
        await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.EXTENSION_SUCCESSFULLY);
    }

}
