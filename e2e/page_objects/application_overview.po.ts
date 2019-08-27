import {by, element} from 'protractor';
import {Util} from "../util";

export class ApplicationOverviewPage {
    private static OWN_APPLICATION_ID: string = "own_applications";

    static async isApplicationRequestPresent(application_name: string): Promise<boolean> {
        await Util.waitForPage('applications');
        await Util.waitForPresenceOfElement(this.OWN_APPLICATION_ID);
        const elm = element(by.id(application_name));

        return await elm.isPresent()
    }

}
