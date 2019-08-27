import {browser, by, element} from 'protractor';
import {Util} from "../util";

export class LoginPage {
    private static timeout: number = browser.params.timeout;
    private static auth = browser.params.login.auth;

    static async login(email: string, psw: string, relog: boolean = false): Promise<any> {

        await browser.driver.get(browser.params.portal);

        console.log("Login");

        const current_url = await browser.driver.getCurrentUrl();
        console.log(current_url);
        if (relog && current_url.includes("userinfo")) {
            console.log("Need to relog");
            await this.logOut();
            await browser.waitForAngularEnabled(false);
            await LoginPage.login(email, psw)
        } else if (this.auth === 'google') {
            console.log('Login with Google');
            await this.useGoogle(email, psw);
        } else {
            console.log('Login with University of Bielefeld');
            await this.useUni(email, psw);
        }
    }

    static async useGoogle(email: string, psw: string): Promise<any> {
        const el = element(by.className('metalist list-group'));
        el.click();
        // Input Email
        await Util.waitForPage('accounts.google.com/signin/oauth/').then(function () {
            element(by.id('identifierId')).sendKeys(email);
            // Click next btn
            element(by.id('identifierNext')).click();
        });

        await Util.waitForPage('accounts.google.com/signin/v2/challenge').then(async function () {
            const password = element(by.name('password'));
            await browser.driver.wait(this.this.until.elementToBeClickable(password), this.this.timeout).then(function () {
                element(by.name('password')).sendKeys(psw);
                element(by.id('passwordNext')).click();
            })
        });
    }

    static async useUni(email: string, psw: string): Promise<any> {
        await Util.waitForPresenceOfElement('query');
        await element(by.id('query')).sendKeys('Bielefeld');
        await element(by.linkText('University of Bielefeld')).click();

        await Util.waitForElementToBeClickableById('password');
        await element(by.id('username')).sendKeys(email);
        await element(by.id('password')).sendKeys(psw);
        await element(by.name('_eventId_proceed')).click();

        await Util.waitForPage('execution=e1s2').then(function () {
            element(by.name('_eventId_proceed')).click()
        });
    }

    static async logOut(): Promise<any> {
        console.log('Restarting browser');
        await browser.restart();
        await browser.waitForAngularEnabled(false);

    }
}
