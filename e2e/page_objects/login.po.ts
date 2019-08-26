import {browser, by, element, protractor, ProtractorExpectedConditions} from 'protractor';

export class LoginPage {
    private timeout: number = browser.params.timeout;
    private until: ProtractorExpectedConditions = protractor.ExpectedConditions;
    private auth = browser.params.login.auth;

    async waitForLoginPage(): Promise<boolean> {
        console.log('Waiting for login page');

        return this.waitForPage('login.elixir-czech');
    }

    async login(email: string, psw: string, relog: boolean = false): Promise<any> {

        await browser.driver.get(browser.params.portal);

        console.log("Login");

        const current_url = await browser.driver.getCurrentUrl();
        console.log(current_url);
        if (relog && current_url.includes("userinfo")) {
            console.log("Need to relog");
            await this.logOut();
            browser.waitForAngularEnabled(false);
            let newLogin = new LoginPage();
            return await newLogin.login(email, psw)


        }

        if (this.auth === 'google') {
            console.log('Login with Google');
            this.useGoogle(email, psw);
        } else {
            console.log('Login with University of Bielefeld');
            this.useUni(email, psw);
        }
    }

    async useGoogle(email: string, psw: string): Promise<any> {
        const el = element(by.className('metalist list-group'));
        el.click();
        // Input Email
        this.waitForPage('accounts.google.com/signin/oauth/').then(function () {
            element(by.id('identifierId')).sendKeys(email);
            // Click next btn
            element(by.id('identifierNext')).click();
        });

        await this.waitForPage('accounts.google.com/signin/v2/challenge').then(async function () {
            const password = element(by.name('password'));
            await browser.driver.wait(this.this.until.elementToBeClickable(password), this.this.timeout).then(function () {
                element(by.name('password')).sendKeys(psw);
                element(by.id('passwordNext')).click();
            })
        });
    }

    async useUni(email: string, psw: string): Promise<any> {
        element(by.id('query')).sendKeys('Bielefeld').then(function () {
            element(by.linkText('University of Bielefeld')).click()
        });
        const pass = element(by.id('password'));
        await browser.driver.wait(this.until.elementToBeClickable(pass), this.timeout).then(function () {
            element(by.id('username')).sendKeys(email);
            element(by.id('password')).sendKeys(psw);
            element(by.name('_eventId_proceed')).click();
        });
        this.waitForPage('execution=e1s2').then(function () {
            element(by.name('_eventId_proceed')).click()
        });
    }

    async waitForPage(url: string): Promise<boolean> {
        console.log(`Waiting until page contains ${url}`);

        return await browser.driver.wait(this.until.urlContains(url), this.timeout);
    }


    async logOut(): Promise<any> {
        console.log('Restarting browser');
        await browser.restart();
        browser.waitForAngularEnabled(false);

    }
}
