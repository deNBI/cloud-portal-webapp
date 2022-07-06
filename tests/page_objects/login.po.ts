import {Page} from '@playwright/test';
import {Util} from '../util';

/**
 * LoginPage.
 */
export class LoginPagePlaywright {
		TEST_RP_WARNING: string = 'testRpWarning';
		TEST_RP_CONTINUE: string = 'Continue';
		readonly page: Page;
		readonly baseURL: string;

		constructor(page: Page, baseURL) {
				this.page = page;
				this.baseURL = baseURL;
		}

		async login(email: string, psw: string, auth_type: string) {
				if (auth_type === 'orcid') {
						await this.useOrcid(email, psw);
				} else if (auth_type === 'google') {
						await this.useGoogle(email, psw);
				}
		}

		async useGoogle(email: string, psw: string): Promise<any> {
				console.log('Using Google Login');

				await this.page.goto(this.baseURL);
				await Util.consoleLogCurrentUrl(this.page)
				await this.page.locator('a', {has: this.page.locator('p:has-text("Google")').locator('visible=true')}).click();
				await this.page.type('input[type="email"]', email);
				await this.page.click('#identifierNext');
				await this.page.waitForSelector('input[type="password"]', {state: 'visible'});
				await this.page.type('input[type="password"]', psw);
				await this.page.waitForSelector('#passwordNext', {state: 'visible'});
				await this.page.click('#passwordNext');
				await Util.consoleLogCurrentUrl(this.page)

				await this.skipElixirTestWarning();
				await Util.consoleLogCurrentUrl(this.page)

				await this.page.waitForNavigation({url: '**/userinfo'});
		}

		async useOrcid(email: string, psw: string): Promise<any> {
				console.log('Using Orcid Login');
				await this.page.goto(this.baseURL);
				await Util.consoleLogCurrentUrl(this.page)


				await this.page.locator('a', {has: this.page.locator('p:has-text("ORCID")').locator('visible=true')}).click();
				await Util.consoleLogCurrentUrl(this.page)

				await this.page.waitForNavigation({url: 'https://orcid.org/signin**'});
				await this.page.type('id=username', email);
				await this.page.type('id=password', psw);
				await this.page.locator('id=signin-button').click();
				await Util.consoleLogCurrentUrl(this.page)

				await this.skipElixirTestWarning();
				await Util.consoleLogCurrentUrl(this.page)

				await this.page.waitForNavigation({url: '**/userinfo'});
		}

		async skipElixirTestWarning(): Promise<void> {
				try {
						await this.page.waitForNavigation({url: `**/oidc/${this.TEST_RP_WARNING}**`});
						await this.page.locator(`text=${this.TEST_RP_CONTINUE}`).click();
				} catch (error) {
						console.log(`Didn't Load Test Warning: ${error}`);
						await Util.consoleLogCurrentUrl(this.page)

				}
		}
}
