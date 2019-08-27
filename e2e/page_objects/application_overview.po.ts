import {browser, by, element, protractor, ProtractorExpectedConditions} from 'protractor';
import {Util} from "../util";

export class ApplicationOverviewPage {
    private timeout: number = browser.params.timeout;
    private OWN_APPLICATION_ID: string = "own_applications";

    async isApplicationRequestPresent(application_name: string): Promise<boolean> {
        await Util.waitForPage('applications');
        await Util.waitForPresenceOfElement(this.OWN_APPLICATION_ID);
        const elm = element(by.id(application_name));

        return await elm.isPresent()
    }

}
