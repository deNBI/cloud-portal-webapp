import ***REMOVED***browser, by, element, protractor, ProtractorExpectedConditions***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from "../util";

export class FormularPage ***REMOVED***
    private static SUBMIT_BTN: string = "submit_btn";
    private static VERIFICATION_BTN: string = "verification_btn";
    private static ACKNOWLEDGE_BTN: string = 'acknowledge_approve_btn';
    private static NOTIFICATION_REDIRECT_BTN: string = "notification_btn_redirect";


    static async submitApplication(): Promise<any> ***REMOVED***
        console.log("Submit Application");

        await Util.clickElementById(this.SUBMIT_BTN);
        await Util.clickElementById(this.VERIFICATION_BTN);
        await Util.clickElementById(this.ACKNOWLEDGE_BTN);
        await Util.clickElementById(this.NOTIFICATION_REDIRECT_BTN);
        console.log('Submitted Application');
    ***REMOVED***

    static async navigateToCloudApplication(): Promise<any> ***REMOVED***
        await Util.navigateToAngularPage('applications/newCloudApplication');

        return await Util.waitForPage('applications/newCloudApplication');
    ***REMOVED***

    static async navigateToSimpleVmApplication(): Promise<any> ***REMOVED***
        await Util.navigateToAngularPage('applications/newSimpleVmApplication');

        await Util.waitForPage('applications/newSimpleVmApplication');

    ***REMOVED***

    static async fillApplicationFormular(name: string): Promise<any> ***REMOVED***

        // fill  Formular
        console.log("Fill form");
        await Util.sendTextToElementByName('project_application_name', name);
        await Util.sendTextToElementByName('project_application_shortname', name);
        await Util.sendTextToElementByName('project_application_description', 'ProtractorTest Description');
        await Util.sendTextToElementByName('project_application_lifetime', '4');
        await Util.sendTextToElementByName('project_application_institute', 'Proctractor Institute');
        await Util.sendTextToElementByName('project_application_workgroup', 'Proctractor Workgroup');
        await Util.sendTextToElementByName('project_application_bmbf_project', 'BMBF Project');
        await Util.sendTextToElementByName('project_application_elixir_project', 'Elixir Project');
        await Util.sendTextToElementById('project_application_de.NBI default', '1');
        await Util.sendTextToElementByName('project_application_horizon2020', 'Horizon2020Project');
        await Util.clickElementById('id_project_application_report_allowed');
        await Util.clickElementById('dissemination_information_accordion');
        await Util.sendTextToElementByName('information_public_title_input', 'A Public Title');
        await Util.clickElementById('public_description_enabled');
        await Util.sendTextToElementByName('information_description', 'A Public Description');
        await Util.clickElementById('information_resources_checkbox');
        await Util.clickElementById('information_lifetime_checkbox');
        await Util.clickElementById('information_project_type_checkbox');
        await Util.clickElementById('information_pi_name_checkbox');
        await Util.clickElementById('information_institution_checkbox');
        await Util.clickElementById('information_workgroup_checkbox');
        await Util.clickElementById('information_project_affiliation_checkbox');
        await Util.clickElementById('platform_newsletter_checkbox');
        await Util.clickElementById('platform_landing_page_checkbox');
        await Util.clickElementById('platform_portal_news_checkbox');
        await Util.clickElementById('platform_twitter_checkbox');
        await Util.clickElementById('project_application_pi_approved_checkbox');
        await Util.clickElementById('project_application_responsibility_checkbox');
    ***REMOVED***
***REMOVED***
