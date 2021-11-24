// spec.js
import { browser } from 'protractor';
import { LoginPage } from '../page_objects/login.po';
import { Util } from '../util';
import { ProjectOverview } from '../page_objects/project_overview.po';

describe('Simple Application Extension Test', (): void => {

	beforeAll(async (): Promise<any> => {
		await browser.waitForAngularEnabled(false);
		await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
	});

	it('should navigate to application overview', async (): Promise<any> => {
		console.log('Starting send a simple vm modification request test!');
		await ProjectOverview.navigateToSimpleProjectverview();
	});

	it('should open the extension request modal', async (): Promise<any> => {
		await ProjectOverview.openExtensionModal(Util.SIMPLE_VM_APPLICATION_NAME);
	});

	it('should fill extension formular', async (): Promise<any> => {
		await ProjectOverview.fillExtensionRequest();
	});

	it('should send an extension request', async (): Promise<any> => {
		await ProjectOverview.sendExtensionRequest(Util.SIMPLE_VM_APPLICATION_NAME);
	});
});
