import ***REMOVED***by, element, browser***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from "../util";

export class ApplicationOverviewPage ***REMOVED***
    private static OWN_APPLICATION_ID: string = "own_applications";
    private static APPLICATION_FOR_REVIEW_ID: string = "applications_for_review";


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


    static async isApplicationRequestPresent(application_name: string): Promise<boolean> ***REMOVED***
        await Util.waitForPage('applications');
        await Util.waitForPresenceOfElement(this.OWN_APPLICATION_ID);
        const elm = element(by.id(application_name));

        return await elm.isPresent()
    ***REMOVED***

    static async approveSimpleVm(application_name: string): Promise<any> ***REMOVED***
        await Util.waitForPage('applications');
        return await Util.clickElementById(application_name);

    ***REMOVED***


***REMOVED***
