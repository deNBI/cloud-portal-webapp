import ***REMOVED***browser, by, element, protractor, ProtractorExpectedConditions***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from "../util";

export class ApplicationOverviewPage ***REMOVED***
    private timeout: number = browser.params.timeout;
    private OWN_APPLICATION_ID: string = "own_applications";

    async isApplicationRequestPresent(application_name: string): Promise<boolean> ***REMOVED***
        await Util.waitForPage('applications');
        await Util.waitForPresenceOfElement(this.OWN_APPLICATION_ID);
        const elm = element(by.id(application_name));

        return await elm.isPresent()
    ***REMOVED***

***REMOVED***
