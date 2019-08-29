import ***REMOVED***by, element***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from '../util';

export class FacilityOverviewPage ***REMOVED***

    private static FACILITY_OVERVIEW_URL: string = 'facility-manager/facilityApplications';
    private static APPLICATION_APPROVAL_BTN_PREFIX: string = 'approval_';
    private static SUCCESSFULLY_APPROVED_APPL: string = 'Successfully approved the application.';
    private static NOTIFICATION_MESSAGE: string = 'notification_message';
    private static EXTENSION_APPROVAL_BTN_PREFIX: string = 'extension_approval_';
    private static EXTENSION_SUCCESSFULLY: string = 'Successfully approved the application modification.';


    static async navigateToFacilityOverview(): Promise<any> ***REMOVED***
        console.log('Navigating to facility overview');
        await Util.navigateToAngularPage(this.FACILITY_OVERVIEW_URL);
    ***REMOVED***

    static async approveApplication(application_name: string): Promise<any> ***REMOVED***
        await Util.clickElementById(this.APPLICATION_APPROVAL_BTN_PREFIX + application_name);
        await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.SUCCESSFULLY_APPROVED_APPL);
    ***REMOVED***

    static async approveApplicationExtension(application_name: string): Promise<any> ***REMOVED***
        await Util.clickElementById(this.EXTENSION_APPROVAL_BTN_PREFIX + application_name);
        await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.EXTENSION_SUCCESSFULLY);
    ***REMOVED***


***REMOVED***
