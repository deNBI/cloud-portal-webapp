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

    static async sendTextToElementByName(name: string, text: string, show_output: boolean = true): Promise<void> {
        if (show_output) {

            console.log(`Send text [${text}] to element ${name}`);
        }
        const elem = element(by.name(name));

        return await elem.sendKeys(text);
    }

    static async sendTextToElementById(id: string, text: string, show_output: boolean = true): Promise<void> {
        if (show_output) {
            console.log(`Send text [${text}] to element ${id}`);
        }
        const elem = element(by.id(id));

        return await elem.sendKeys(text);
    }

    static async clickElementById(id: string): Promise<void> {
        await this.waitForElementToBeClickableById(id);
        console.log(`Clicking element ${id}`);
        const elem = element(by.id(id));

        return await elem.click();
    }

    static async clickElementByName(name: string): Promise<void> {
        await this.waitForElementToBeClickableByName(name);
        console.log(`Clicking element ${name}`);
        const elem = element(by.name(name));

        return await elem.click();
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

    static async waitForPresenceOfElementById(id: string): Promise<boolean> {
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until page contains element ${id}`);
        const elem = element(by.id(id));
        return await browser.driver.wait(until.presenceOf(elem), this.timeout, 'Element taking too long to appear in the DOM');
    }

    static async waitForVisibilityOfElementById(id: string): Promise<boolean> {
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until element ${id} is visibile`);
        const elem = element(by.id(id));
        return await browser.driver.wait(until.visibilityOf(elem), this.timeout, 'Element taking too long to be visibile');
    }

    static async waitForElementToBeClickableById(id: string): Promise<boolean> {
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until element is clickable ${id}`);
        const elem = element(by.id(id));
        return await browser.driver.wait(until.elementToBeClickable(elem), this.timeout, 'Element taking too long to be clickable');
    }

    static async waitForElementToBeClickableByName(name: string): Promise<boolean> {
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until element is clickable ${name}`);
        const elem = element(by.name(name));
        return await browser.driver.wait(until.elementToBeClickable(elem), this.timeout, 'Element taking too long to be clickable');
    }


}
