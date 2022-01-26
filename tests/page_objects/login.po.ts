import {
	Locator, Page, expect, chromium, FullConfig,
} from '@playwright/test';

/**
 * LoginPage.
 */
export class LoginPagePlaywright {

	TEST_RP_WARNING: string = 'testRpWarning';
	TEST_RP_CONTINUE: string = 'Continue';
	readonly page: Page;
	readonly baseUrl: string;

	constructor(page: Page, baseURL) {
		this.page = page;
		this.baseUrl = baseURL;

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

		await this.page.goto(this.baseUrl);
		await this.page.locator('strong:has-text("Google")').locator('visible=true').click();
		await this.page.type('input[type="email"]', email);
		await this.page.click('#identifierNext');
		await this.page.waitForSelector('input[type="password"]', { state: 'visible' });
		await this.page.type('input[type="password"]', psw);
		await this.page.waitForSelector('#passwordNext', { state: 'visible' });
		await this.page.click('#passwordNext');
		await this.skipElixirTestWarning();
		await this.page.waitForNavigation({ url: '**/userinfo' });
	}

	async useOrcid(email: string, psw: string): Promise<any> {
		console.log('Using Orcid Login');
		await this.page.goto(this.baseUrl);
		await this.page.locator('strong:has-text("Orcid")').locator('visible=true').click();
		await this.page.waitForNavigation('https://orcid.org/signin');
		await this.page.type('id=username', email);
		await this.page.type('id=password', psw);
		await this.page.locator('id=signin-button').click();

		await this.skipElixirTestWarning();
		await this.page.waitForNavigation({ url: '**/userinfo' });
	}

	async skipElixirTestWarning(): Promise<void> {
		await this.page.waitForNavigation({ url: `**/oidc/${this.TEST_RP_WARNING}**` });
		await this.page.locator(`text=${this.TEST_RP_CONTINUE}`).click();
	}

}
