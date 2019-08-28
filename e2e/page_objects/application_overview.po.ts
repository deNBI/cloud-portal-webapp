import ***REMOVED***by, element, browser***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from "../util";

export class ApplicationOverviewPage ***REMOVED***
    private static OWN_APPLICATION_ID: string = "own_applications";
    private static SUBMIT_MODEL_BTN: string = "submit_modal_btn";
    private static SUBMIT_RENEWAL_BTN: string = 'submit_renewal_btn';
    private static EXTENSION_RESULT: string = 'extension result';
    private static EXTENSION_SUCCESFFULY_SUBMITTED: string = 'Modify request successfully submitted!'


    static async navigateToApplicationOverview(): Promise<any> ***REMOVED***
        console.log("Navigate to Application Overview form");
        let url = await browser.driver.getCurrentUrl();
        console.log('GetUrl: ' + url);
        url = url.substring(0, url.indexOf('#'));
        console.log('SubstringUrl: ' + url);
        console.log('AddedUrl: ' + url + '#/applications');

        await browser.driver.get(url + '#/applications');
        await Util.waitForPage('#/applications');
    ***REMOVED***

    static async sendModificationRequest(application_name: string): Promise<any> ***REMOVED***
        await Util.clickElementById('extension_' + application_name);
        await Util.waitForVisibilityOfElementById('id_project_application_renewal_lifetime');
        await this.fillModificationRequest();
        await Util.clickElementById(this.SUBMIT_RENEWAL_BTN);
        await Util.clickElementById(this.SUBMIT_MODEL_BTN);
        await Util.waitForTextPresenceInElementById(this.EXTENSION_RESULT, this.EXTENSION_SUCCESFFULY_SUBMITTED);
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
        return await Util.waitForTextPresenceInElementById('notification_message', "The new project was created and assigned to de.NBI Cloud Portal - Development.");


    ***REMOVED***


***REMOVED***
