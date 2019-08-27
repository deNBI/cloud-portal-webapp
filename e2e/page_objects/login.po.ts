import ***REMOVED***browser, by, element***REMOVED*** from 'protractor';
import ***REMOVED***Util***REMOVED*** from "../util";

export class LoginPage ***REMOVED***
    private static timeout: number = browser.params.timeout;
    private static auth = browser.params.login.auth;

    static async login(email: string, psw: string, relog: boolean = false): Promise<any> ***REMOVED***

        await browser.driver.get(browser.params.portal);

        console.log("Login");

        const current_url = await browser.driver.getCurrentUrl();
        console.log(current_url);
        if (relog && current_url.includes("userinfo")) ***REMOVED***
            console.log("Need to relog");
            await this.logOut();
            await browser.waitForAngularEnabled(false);
            await LoginPage.login(email, psw)
        ***REMOVED*** else if (this.auth === 'google') ***REMOVED***
            console.log('Login with Google');
            await this.useGoogle(email, psw);
        ***REMOVED*** else ***REMOVED***
            console.log('Login with University of Bielefeld');
            await this.useUni(email, psw);
        ***REMOVED***
    ***REMOVED***

    static async useGoogle(email: string, psw: string): Promise<any> ***REMOVED***
        const el = element(by.className('metalist list-group'));
        el.click();
        // Input Email
        await Util.waitForPage('accounts.google.com/signin/oauth/').then(function () ***REMOVED***
            element(by.id('identifierId')).sendKeys(email);
            // Click next btn
            element(by.id('identifierNext')).click();
        ***REMOVED***);

        await Util.waitForPage('accounts.google.com/signin/v2/challenge').then(async function () ***REMOVED***
            const password = element(by.name('password'));
            await browser.driver.wait(this.this.until.elementToBeClickable(password), this.this.timeout).then(function () ***REMOVED***
                element(by.name('password')).sendKeys(psw);
                element(by.id('passwordNext')).click();
            ***REMOVED***)
        ***REMOVED***);
    ***REMOVED***

    static async useUni(email: string, psw: string): Promise<any> ***REMOVED***
        await Util.waitForPresenceOfElement('query');
        await element(by.id('query')).sendKeys('Bielefeld');
        await element(by.linkText('University of Bielefeld')).click();

        await Util.waitForElementToBeClickableById('password');
        await element(by.id('username')).sendKeys(email);
        await element(by.id('password')).sendKeys(psw);
        await element(by.name('_eventId_proceed')).click();

        await Util.waitForPage('execution=e1s2').then(function () ***REMOVED***
            element(by.name('_eventId_proceed')).click()
        ***REMOVED***);
    ***REMOVED***

    static async logOut(): Promise<any> ***REMOVED***
        console.log('Restarting browser');
        await browser.restart();
        await browser.waitForAngularEnabled(false);

    ***REMOVED***
***REMOVED***
