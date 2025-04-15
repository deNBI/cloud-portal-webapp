import { Page } from '@playwright/test';
import { Util } from '../util';

/**
 * LoginPage.
 */
export class LoginPagePlaywright {
	TEST_RP_WARNING: string = 'testSp';
	TEST_RP_CONTINUE: string = 'Continue';
	CONSENT_CONTINUE: string = 'Yes, continue';
	AUTHORIZE_BTN: string = 'authorize-button';

	ACCEPT_ALL_COOKIES = 'Reject Unnecessary Cookies';
	REGISTER_TEST_COMMUNITY ='Register into Life Science Community - Test Environment'
	OIDC_ACCESS_DENIED='https://login.elixir-czech.org/oidc/unauthorizedEnvVosGroups'
	SUBMIT_LIFESCIENCE_TEST_URL="https://signup.aai.lifescience-ri.eu/fed/registrar/?vo=lifescience_test"

	readonly page: Page;
	readonly baseURL: string = '';

	constructor(page: Page, baseURL: string | undefined) {
		this.page = page;
		if (baseURL) {
			this.baseURL = baseURL;
		}
	}

	async login(email: string, psw: string, auth_type: string) {
		await this.page.goto(this.baseURL);
		// Currently login directly forwards to lifescience login
		// await this.page.locator(`text=${this.KEYCLOAK_BTN_TEXT}`).click();
		// await this.page.locator(`text=${this.KEYCLOAK_CONTINUE_BTN}`).click();

		if (auth_type === 'orcid') {
			await this.useOrcid(email, psw);
		} else if (auth_type === 'google') {
			await this.useGoogle(email, psw);
		}
	}

	async useGoogle(email: string, psw: string): Promise<any> {
		console.log('Using Google Login');

		await Util.consoleLogCurrentUrl(this.page);
		await this.page.locator('a', { has: this.page.locator('p:has-text("Google")').locator('visible=true') }).click();
		await this.page.type('input[type="email"]', email);
		await this.page.click('#identifierNext');
		await this.page.waitForSelector('input[type="password"]', { state: 'visible' });
		await this.page.type('input[type="password"]', psw);
		await this.page.waitForSelector('#passwordNext', { state: 'visible' });
		await this.page.click('#passwordNext');
		await Util.consoleLogCurrentUrl(this.page);

		await this.skipElixirTestWarning();
		await Util.consoleLogCurrentUrl(this.page);

		await this.page.waitForURL('**/userinfo');
	}


	async useOrcid(email: string, psw: string): Promise<any> {
		console.log('Using Orcid Login');
		await Util.consoleLogCurrentUrl(this.page);
		await this.page.locator('a:has-text("ORCID")').elementHandle({ timeout: 10000});
		const link = this.page.locator('a:has-text("ORCID")').first();
		await link.click();
		await Util.consoleLogCurrentUrl(this.page);
		await this.acceptAllCookies();
		console.log('Waiting for login page');
		await Util.consoleLogCurrentUrl(this.page);
		await this.page.waitForURL('https://orcid.org/signin**', { timeout: 10000 });
		await this.page.fill('id=username-input', email);
		await this.page.fill('id=password', psw);
		console.log('click signin button');

		await this.page.locator('id=signin-button').click();
		console.log('clicked signin button');

		await Util.consoleLogCurrentUrl(this.page);

		await this.authorizeAccess();
		await this.skipElixirTestWarning();
		await this.skipAccessDenied()

		await this.giveConsent();
		await Util.consoleLogCurrentUrl(this.page);
		//	await this.skipElixirTestWarning()
		await this.page.waitForURL(`**/userinfo`);
		await Util.consoleLogCurrentUrl(this.page);
	}

	async acceptAllCookies(): Promise<void> {
		console.log('checking for all cookies');
		try {
			const acceptCookiesButton = this.page.locator(`text=${this.ACCEPT_ALL_COOKIES}`).first();
			await this.page.waitForSelector(`text=${this.ACCEPT_ALL_COOKIES}`, { timeout: 5000 }); // Wait for the button to appear
			await acceptCookiesButton.click();
			console.log('Accept All Cookies button clicked');
		} catch (error) {
			console.log(`Didn't Load accept cookies: ${error}`);
		} finally {
			await Util.consoleLogCurrentUrl(this.page);
		}
	}

	async skipAccessDenied(): Promise<void> {
		console.log('Checking if Access Denied');
		try {
			await this.page.waitForURL(this.OIDC_ACCESS_DENIED, { timeout: 5000 });
			console.log("Loaded Access denied")

			const [newPage] = await Promise.all([
				this.page.context().waitForEvent('page'),
				this.page.locator(`text=${this.REGISTER_TEST_COMMUNITY}`).click()
			]);

			// Wait until the new page is loaded
			await newPage.waitForLoadState();

			// Now perform action on the new page

			console.log('Register lifesciecne clicked');

			await newPage.waitForSelector(`text=Submit`, { timeout: 10000 }); // Wait for the button to appear

			await newPage.locator(`text=Submit`).click();
			console.log("Submitted")
		} catch (error) {
			console.log(`Didn't load access denied: ${error}`);
		} finally {
			await Util.consoleLogCurrentUrl(this.page);
		}
	}



	async authorizeAccess(): Promise<void> {
		console.log('Authorize');
		try {
		  await this.page.waitForURL(`**/oauth/authorize`, { timeout: 5000 });
		  await this.page.waitForSelector('[id="authorize-button"]');
		  const authorizeButton = await this.page.$('[id="authorize-button"]');
		  await authorizeButton?.click();
		  return;
		} catch (error) {
		  console.log('Timed out waiting for authorization');
		}

		await Util.consoleLogCurrentUrl(this.page);
	  }

	async giveConsent(): Promise<void> {
		console.log('give consent');
		try {
			await this.page.waitForURL('**/oidc/auth/authorize**', { timeout: 10000 });
			await this.page.locator(`text=${this.CONSENT_CONTINUE}`).click();
		} catch (error) {
			console.log(`Didn't Load Consent: ${error}`);
			await Util.consoleLogCurrentUrl(this.page);
		}
	}

	async skipElixirTestWarning(): Promise<void> {
		console.log('checking for elixir warnining');
		try {
			await this.page.waitForURL(`**/${this.TEST_RP_WARNING}**`, { timeout: 5000 });
			await this.page.locator(`text=${this.TEST_RP_CONTINUE}`).click();
			//	await this.page.waitForURL('**/profile');
		} catch (error) {
			console.log(`Didn't Load Test Warning: ${error}`);
			await Util.consoleLogCurrentUrl(this.page);
		}
	}
}
