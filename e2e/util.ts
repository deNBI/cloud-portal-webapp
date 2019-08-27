import ***REMOVED***browser, by, element, protractor, ProtractorExpectedConditions***REMOVED*** from 'protractor';

export class Util ***REMOVED***
    private static timeout: number = browser.params.timeout;
    private static auth = browser.params.login.auth;


    static async waitForPage(url: string): Promise<boolean> ***REMOVED***
        const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

        console.log(`Waiting until page contains $***REMOVED***url***REMOVED***`);
        return await browser.driver.wait(until.urlContains(url), this.timeout);
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


***REMOVED***
