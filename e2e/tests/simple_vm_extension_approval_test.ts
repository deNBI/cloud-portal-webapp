// spec.js
import { browser } from 'protractor';
import { LoginPage } from '../page_objects/login.po';
import { ApplicationOverviewPage } from '../page_objects/application_overview.po';
import { Util } from '../util';

describe('Simple Application Extension Approval Test', (): void => {

	beforeAll(async (): Promise<any> => {
		await browser.waitForAngularEnabled(false);
		await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
	});

	it('should navigate to application overview', async (): Promise<any> => {
		await ApplicationOverviewPage.navigateToApplicationOverview();
	});

	it('should approve a simple vm modification request', async (): Promise<any> => {
		await ApplicationOverviewPage.approveExtensionRequest(Util.SIMPLE_VM_APPLICATION_NAME);
	});
});
