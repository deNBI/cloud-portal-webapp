import {browser, by, element, protractor, ProtractorExpectedConditions} from 'protractor';

export class Util {
    private static timeout: number = browser.params.timeout;
    private static auth = browser.params.login.auth;
    private static _SIMPLE_VM_APPLICATION_NAME: string = "PTSimpleVM";
    private static _OPENSTACK_APPLICATION_NAME: string = "PTOpenStack";


    static get SIMPLE_VM_APPLICATION_NAME(): string {
        return this._SIMPLE_VM_APPLICATION_NAME;
    }

    static get OPENSTACK_APPLICATION_NAME(): string {
        return this._OPENSTACK_APPLICATION_NAME;
    }

    static async waitForPage(url: string): Promise<boolean> {
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until page contains ${url}`);
        return await browser.driver.wait(until.urlContains(url), this.timeout);
    }


    static async waitForTextPresenceInElementById(id: string, text: string): Promise<boolean> {
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until text [${text}] appears in  element ${id}`);
        const elem = element(by.id(id));
        return await browser.driver.wait(until.textToBePresentInElement(elem, text), this.timeout, 'Text taking too long to appear in the Element');
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
