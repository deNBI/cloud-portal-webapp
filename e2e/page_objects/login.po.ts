import ***REMOVED***browser, by, element***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from "../util";

export class LoginPage ***REMOVED***
    private static timeout: number = browser.params.timeout;

    static async login(email: string, psw: string, auth: string, relog: boolean = false): Promise<any> ***REMOVED***

        await browser.driver.get(browser.params.portal);

        console.log("Login");

        const current_url = await browser.driver.getCurrentUrl();
        console.log(current_url);
        if (relog && current_url.includes("userinfo")) ***REMOVED***
            console.log("Need to relog");
            await this.logOut();
            await browser.waitForAngularEnabled(false);
            await LoginPage.login(email, psw, auth)
        ***REMOVED*** else if (auth === 'google') ***REMOVED***
            console.log('Login with Google');
            await this.useGoogle(email, psw);
        ***REMOVED*** else ***REMOVED***
            console.log('Login with University of Bielefeld');
            await this.useUni(email, psw);
        ***REMOVED***
    ***REMOVED***

    static async useGoogle(email: string, psw: string): Promise<any> ***REMOVED***
        await element(by.className('metalist list-group')).click();
        // Input Email
        await Util.waitForPage('accounts.google.com/signin/oauth/');
        await element(by.id('identifierId')).sendKeys(email);
        // Click next btn
        await Util.clickElementById('identifierNext');
        await Util.waitForPage('accounts.google.com/signin/v2/challenge');
        await Util.waitForElementToBeClickableById('password');
        await element(by.name('password')).sendKeys(psw);
        browser.sleep(1000);
        await Util.clickElementById('passwordNext');
        await Util.waitForPage('userinfo');

    ***REMOVED***

    static async useUni(email: string, psw: string): Promise<any> ***REMOVED***
        await Util.waitForPresenceOfElement('query');
        await Util.sendTextToElementById('query', 'Bielefeld');
        await element(by.linkText('University of Bielefeld')).click();
        await Util.waitForElementToBeClickableById('password');
        await Util.sendTextToElementById('username', email);
        await Util.sendTextToElementById('password', psw);
        await Util.clickElementByName('_eventId_proceed');
        await Util.waitForPage('execution=e1s2');
        await Util.clickElementByName('_eventId_proceed');
        await Util.waitForPage('userinfo');
    ***REMOVED***

    static async logOut(): Promise<any> ***REMOVED***
        console.log('Restarting browser');
        await browser.restart();
        await browser.waitForAngularEnabled(false);

    ***REMOVED***
***REMOVED***
