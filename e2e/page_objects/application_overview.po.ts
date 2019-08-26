import {browser, by, element, protractor, ProtractorExpectedConditions} from 'protractor';

export class ApplicationOverviewPage {
    private timeout: number = browser.params.timeout;
    private until: ProtractorExpectedConditions = protractor.ExpectedConditions;
    private auth = browser.params.login.auth;
    private OWN_APPLICATION_ID: string = "own_applications";

    async isApplicationRequestPresent(application_name: string): Promise<boolean> {
        console.log("Check if " + application_name + " is present");
        await browser.wait(this.until.urlContains('applications'));
        const own_applications = element(by.id(this.OWN_APPLICATION_ID));
        browser.wait(this.until.presenceOf(own_applications), this.timeout, 'Element taking too long to appear in the DOM');
        const elm = element(by.id(application_name));
        return elm.isPresent()
    }

}
