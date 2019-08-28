import ***REMOVED***browser, by, element, protractor, ProtractorExpectedConditions***REMOVED*** from 'protractor';

export class Util ***REMOVED***
    private static timeout: number = browser.params.timeout;
    private static auth = browser.params.login.auth;
    private static _SIMPLE_VM_APPLICATION_NAME: string = "PTSimpleVM";
    private static _OPENSTACK_APPLICATION_NAME: string = "PTOpenStack";


    static get SIMPLE_VM_APPLICATION_NAME(): string ***REMOVED***
        return this._SIMPLE_VM_APPLICATION_NAME;
    ***REMOVED***

    static get OPENSTACK_APPLICATION_NAME(): string ***REMOVED***
        return this._OPENSTACK_APPLICATION_NAME;
    ***REMOVED***

    static async sendTextToElementByName(name: string, text: string): Promise<void> ***REMOVED***
        console.log(`Send text [$***REMOVED***text***REMOVED***] to element $***REMOVED***name***REMOVED***`);
        const elem = element(by.name(name));

        return await elem.sendKeys(text);
    ***REMOVED***

    static async sendTextToElementById(id: string, text: string): Promise<void> ***REMOVED***
        console.log(`Send text [$***REMOVED***text***REMOVED***] to element $***REMOVED***id***REMOVED***`);
        const elem = element(by.id(id));

        return await elem.sendKeys(text);
    ***REMOVED***

    static async clickElementById(id: string): Promise<void> ***REMOVED***
        await this.waitForElementToBeClickableById(id);
        console.log(`Clicking element $***REMOVED***id***REMOVED***`);
        const elem = element(by.id(id));

        return await elem.click();
    ***REMOVED***

    static async clickElementByName(name: string): Promise<void> ***REMOVED***
        await this.waitForElementToBeClickableByName(name);
        console.log(`Clicking element $***REMOVED***name***REMOVED***`);
        const elem = element(by.name(name));

        return await elem.click();
    ***REMOVED***

    static async waitForPage(url: string): Promise<boolean> ***REMOVED***
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until page contains $***REMOVED***url***REMOVED***`);
        return await browser.driver.wait(until.urlContains(url), this.timeout);
    ***REMOVED***


    static async waitForTextPresenceInElementById(id: string, text: string): Promise<boolean> ***REMOVED***
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until text [$***REMOVED***text***REMOVED***] appears in  element $***REMOVED***id***REMOVED***`);
        const elem = element(by.id(id));
        return await browser.driver.wait(until.textToBePresentInElement(elem, text), this.timeout, 'Text taking too long to appear in the Element');
    ***REMOVED***

    static async waitForPresenceOfElement(id: string): Promise<boolean> ***REMOVED***
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until page contains element $***REMOVED***id***REMOVED***`);
        const elem = element(by.id(id));
        return await browser.driver.wait(until.presenceOf(elem), this.timeout, 'Element taking too long to appear in the DOM');
    ***REMOVED***

    static async waitForElementToBeClickableById(id: string): Promise<boolean> ***REMOVED***
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until element is clickable $***REMOVED***id***REMOVED***`);
        const elem = element(by.id(id));
        return await browser.driver.wait(until.elementToBeClickable(elem), this.timeout, 'Element taking too long to be clickable');
    ***REMOVED***

    static async waitForElementToBeClickableByName(name: string): Promise<boolean> ***REMOVED***
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until element is clickable $***REMOVED***name***REMOVED***`);
        const elem = element(by.name(name));
        return await browser.driver.wait(until.elementToBeClickable(elem), this.timeout, 'Element taking too long to be clickable');
    ***REMOVED***


***REMOVED***
