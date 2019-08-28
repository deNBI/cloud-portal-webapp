import ***REMOVED***by, element, browser***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from "../util";

export class ApplicationOverviewPage ***REMOVED***
    private static OWN_APPLICATION_ID: string = "own_applications";
    private static SUBMIT_MODEL_BTN: string = "submit_modal_btn";
    private static SUBMIT_RENEWAL_BTN: string = 'submit_renewal_btn';
    private static EXTENSION_RESULT: string = 'extension result';
    private static EXTENSION_SUCCESSFULLY_SUBMITTED: string = 'Modify request successfully submitted!';
    private static EXTENSION_SUCCESSFULLY_APPROVED: string = 'Modify request successfully approved!';
    private static EXTENSION_APPROVAL_BTN_PREFIX: string = 'extension_approval_';
    private static EXTENSION_REQUEST_BTN_PREFIX: string = 'extension_';
    private static COMPUTE_CENTER_SELECTION_PREFIX: string = 'id_compute_center_option_';
    private static DEFAULT_DENBI_COMPUTE_CENTER: string = 'de.NBI Cloud Portal - Development';
    private static CLOUD_PROJECT_CREATED: string = 'The new project was created';
    private static SIMPLE_VM_CREATED: string = 'The new project was created and assigned to de.NBI Cloud Portal - Development.';
    private static NOTIFICATION_MESSAGE: string = 'notification_message';


    static async navigateToApplicationOverview(): Promise<any> ***REMOVED***
        console.log("Navigate to Application Overview form");
        await Util.navigateToAngularPage('applications');
        await Util.waitForPage('applications');
    ***REMOVED***


    static async approveModificationRequest(application_name: string): Promise<any> ***REMOVED***
        await Util.clickElementById(this.EXTENSION_APPROVAL_BTN_PREFIX + application_name);
        await Util.waitForTextPresenceInElementById(this.EXTENSION_RESULT, this.EXTENSION_SUCCESSFULLY_APPROVED);

    ***REMOVED***

    static async sendModificationRequest(application_name: string): Promise<any> ***REMOVED***
        await Util.clickElementById(this.EXTENSION_REQUEST_BTN_PREFIX + application_name);
        await Util.waitForVisibilityOfElementById('id_project_application_renewal_lifetime');
        await this.fillModificationRequest();
        await Util.clickElementById(this.SUBMIT_RENEWAL_BTN);
        await Util.clickElementById(this.SUBMIT_MODEL_BTN);
        await Util.waitForTextPresenceInElementById(this.EXTENSION_RESULT, this.EXTENSION_SUCCESSFULLY_SUBMITTED);
    ***REMOVED***


    static async fillModificationRequest(): Promise<any> ***REMOVED***
        await Util.sendTextToElementById('id_project_application_renewal_lifetime', '1');
        await Util.sendTextToElementById('id_project_application_renewal_de.NBI default', '1');
        await Util.sendTextToElementById('id_project_application_renewal_volume_counter', '1');
        await Util.sendTextToElementById('id_project_application_renewal_volume_limit', '1');
        await Util.sendTextToElementById('id_project_application_renewal_comment', 'This is a Protrector test modificatioN!');
    ***REMOVED***


    static async isApplicationRequestPresent(application_name: string): Promise<boolean> ***REMOVED***
        await Util.waitForPage('applications');
        await Util.waitForPresenceOfElementById(this.OWN_APPLICATION_ID);
        const elm = element(by.id(application_name));

        return await elm.isPresent()
    ***REMOVED***

    static async approveSimpleVm(application_name: string): Promise<any> ***REMOVED***
        await Util.waitForPage('applications');
        await Util.clickElementById(application_name);
        return await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.SIMPLE_VM_CREATED);
    ***REMOVED***

    static async approveCloudApplication(application_name: string): Promise<any> ***REMOVED***
        await Util.waitForPage('applications');
        await Util.waitForPresenceOfElementById(this.COMPUTE_CENTER_SELECTION_PREFIX + application_name);
        await Util.getOptionOfSelect(this.DEFAULT_DENBI_COMPUTE_CENTER, this.COMPUTE_CENTER_SELECTION_PREFIX + application_name);
        await Util.clickElementById(application_name);
        return await Util.waitForTextPresenceInElementById(this.NOTIFICATION_MESSAGE, this.CLOUD_PROJECT_CREATED);
    ***REMOVED***
***REMOVED***
