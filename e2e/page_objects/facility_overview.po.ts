import {by, element} from 'protractor';
import {Util} from '../util';

export class FacilityOverviewPage {

    private static FACILITY_OVERVIEW_URL: string = 'facility-manager/facilityApplications';
    private static APPLICATION_APPROVAL_BTN_PREFIX: string = 'approval_';
    private static SUCCESSFULLY_APPROVED_APPL: string = 'Successfully approved the application.';
    private static NOTIFICATION_MESSAGE: string = 'notification_message';


    static async navigateToFacilityOverview(): Promise<any> {
        console.log('Navigating to facility overview');
        await Util.navigateToAngularPage(this.FACILITY_OVERVIEW_URL);
    }

    static async approveApplication(application_name: string): Promise<any> {
        await Util.clickElementById(this.APPLICATION_APPROVAL_BTN_PREFIX + application_name);
        await Util.sendTextToElementById(this.NOTIFICATION_MESSAGE, this.SUCCESSFULLY_APPROVED_APPL);
    }


}
