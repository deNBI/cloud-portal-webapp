import ***REMOVED***by, element***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from "../util";

export class ApplicationOverviewPage ***REMOVED***
    private static OWN_APPLICATION_ID: string = "own_applications";

    static async isApplicationRequestPresent(application_name: string): Promise<boolean> ***REMOVED***
        await Util.waitForPage('applications');
        await Util.waitForPresenceOfElement(this.OWN_APPLICATION_ID);
        const elm = element(by.id(application_name));

        return await elm.isPresent()
    ***REMOVED***

***REMOVED***
