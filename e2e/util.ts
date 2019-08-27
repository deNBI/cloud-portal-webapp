import {browser, by, element, protractor, ProtractorExpectedConditions} from 'protractor';

export class Util {
    private static timeout: number = browser.params.timeout;
    private static auth = browser.params.login.auth;


    static async waitForPage(url: string): Promise<boolean> {
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until page contains ${url}`);
        return await browser.driver.wait(until.urlContains(url), this.timeout);
    }

    static async waitForPresenceOfElement(id: string): Promise<boolean> {
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until page contains element ${id}`);
        const elem = element(by.id(id));
        return await browser.driver.wait(until.presenceOf(elem), this.timeout, 'Element taking too long to appear in the DOM');
    }

    static async waitForElementToBeClickableById(id: string): Promise<boolean> {
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until element is clickable ${id}`);
        const elem = element(by.id(id));
        return await browser.driver.wait(until.elementToBeClickable(elem), this.timeout, 'Element taking too long to be clickable');
    }


}
