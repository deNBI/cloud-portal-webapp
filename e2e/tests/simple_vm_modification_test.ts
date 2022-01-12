// spec.js
import { browser } from 'protractor';
import { LoginPage } from '../page_objects/login.po';
import { Util } from '../util';
import { ProjectOverview } from '../page_objects/project_overview.po';

describe('Simple Application Modification Test', (): void => {

	beforeAll(async (): Promise<any> => {
		await browser.waitForAngularEnabled(false);
		await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
	});

	it('should navigate to application overview', async (): Promise<any> => {
		console.log('Starting send a simple vm modification request test!');
		await ProjectOverview.navigateToSimpleProjectverview();
	});

	it('should open the modification request modal', async (): Promise<any> => {
		await ProjectOverview.openModificationModal(Util.SIMPLE_VM_APPLICATION_NAME);
	});

	it('should have old values prefilled', async (): Promise<any> => {
		await ProjectOverview.areDefaultValuesSetSimpleVM();
	});

	it('should fill modification formular', async (): Promise<any> => {
		await ProjectOverview.fillModificationRequest();
	});

	it('should send a modification request', async (): Promise<any> => {
		await ProjectOverview.sendModificationRequest(Util.SIMPLE_VM_APPLICATION_NAME);
	});
});
