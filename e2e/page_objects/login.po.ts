import { browser, by, element } from 'protractor';
import { Util } from '../util';

/**
 * LoginPage.
 */
export class LoginPage {

	private static timeout: number = browser.params.timeout;
	private static TEST_RP_WARNING: string = 'testRpWarning';
	private static TEST_RP_CONTINUE: string = 'continue'

	static async login(email: string, psw: string, auth: string, relog: boolean = false): Promise<any> {
		await browser.driver.get(browser.params.portal);
		Util.logInfo('Login');
		const current_url: any = await browser.driver.getCurrentUrl();
		Util.logInfo(current_url);
		if (relog) {
			Util.logInfo('Need to relog');
			await this.logOut();
			await browser.waitForAngularEnabled(false);
			await LoginPage.login(email, psw, auth);
		} else if (auth === 'google') {
			Util.logInfo('Login with Google');
			await this.useGoogle(email, psw);
		} else if (auth === 'orcid') {
			Util.logInfo('Login with Orcid');
			await this.useOrcid(email, psw);
		} else {
			Util.logInfo('Login with University of Bielefeld');
			await this.useUni(email, psw);
		}
		Util.logInfo('Checking login success.');
		await Util.waitForPage('userinfo');
	}

	static async useOrcid(email: string, psw: string): Promise<any> {
		if (!await Util.clickElementByLinkTextIgnoreError('ORCID')) {
			await Util.clickElementByLinkText('Sign in with ORCID');
		}
		// Input Email
		await Util.waitForPage('https://orcid.org/signin');
		await Util.sendTextToElementByIdSecure('username', email);
		await Util.sendTextToElementByIdSecure('password', psw);
		await Util.clickElementById('signin-button');
		if (await Util.waitForPageIgnoreError(this.TEST_RP_WARNING)) {
			await Util.clickElementByName(this.TEST_RP_CONTINUE);
		}
		await Util.waitForPage('userinfo');
		Util.logInfo(await browser.driver.getCurrentUrl());
	}

	static async useGoogle(email: string, psw: string): Promise<any> {
		if (!await Util.clickElementByLinkTextIgnoreError('Google')) {
			await Util.clickElementByLinkText('Sign in with Google');
		}
		// Input Email
		await Util.waitForPage('accounts.google.com/o/oauth2/');
		await Util.sendTextToElementByIdSecure('identifierId', email);
		// Click next btn
		await Util.clickElementById('identifierNext');
		await Util.waitForPage('accounts.google.com/signin/v2/challenge');
		await Util.waitForElementToBeClickableById('password');
		await Util.sendTextToElementByName('password', psw, false);
		await Util.clickElementById('passwordNext');
		if (await Util.waitForPageIgnoreError(this.TEST_RP_WARNING)) {
			await Util.clickElementByName(this.TEST_RP_CONTINUE);
		}
		await Util.waitForPage('userinfo');
	}

	static async useUni(email: string, psw: string): Promise<any> {
		Util.logInfo(await browser.driver.getPageSource());
		await Util.waitForPresenceOfElementById('query');
		await Util.sendTextToElementByIdUnsecure('query', 'Bielefeld');
		await element(by.linkText('University of Bielefeld')).click();
		await Util.waitForElementToBeClickableById('password');
		await Util.sendTextToElementByIdSecure('username', email);
		await Util.sendTextToElementByIdSecure('password', psw);
		await Util.clickElementByName('_eventId_proceed');
		await Util.waitForPage('execution=e1s2');
		await Util.clickElementByName('_eventId_proceed');
		if (await Util.waitForPageIgnoreError(this.TEST_RP_WARNING)) {
			await Util.clickElementByName(this.TEST_RP_CONTINUE);
		}
		await Util.waitForPage('userinfo');
	}

	static async logOut(): Promise<any> {
		Util.logInfo('Restarting browser');
		await browser.restart();
		await browser.waitForAngularEnabled(false);
		await browser.manage().window().setSize(browser.params.width, browser.params.height);
	}

}
