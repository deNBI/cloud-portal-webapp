// spec.js
import { browser } from 'protractor';
import { LoginPage } from '../page_objects/login.po';
import { FormularPage } from '../page_objects/application_formular.po';
import { Util } from '../util';
import { ProjectOverview } from '../page_objects/project_overview.po';

describe('Simple Application Test without PI', (): void => {

	beforeAll(async (): Promise<any> => {
		await browser.waitForAngularEnabled(false);
		await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
	});

	it('should navigate to the simple vm form', async (): Promise<any> => {
		Util.logInfo('Starting send a simple vm application test!');
		await FormularPage.navigateToSimpleVmApplication();
	});

	it('should fill the simple vm form', async (): Promise<any> => {
		await FormularPage.fillApplicationFormular(Util.SIMPLE_VM_APPLICATION_NAME_NO_PI);
	});

	it('should submit the simple vm form', async (): Promise<any> => {
		await FormularPage.submitApplication();
	});

	it('should successfully submitted the application', async (): Promise<any> => {
		const isPresent: boolean = await FormularPage.isApplicationSubmitted();
		expect(isPresent).toBeTruthy();
	});

	it('should load project overview', async (): Promise<any> => {
		await Util.clickElementById(FormularPage.NOTIFICATION_BTN_REDIRECT);
		await Util.waitForTextInUrl('project-management');
	});

	it('should have no pi set', async (): Promise<any> => {
		const isAbsent: boolean = await ProjectOverview.hasPi();
		expect(isAbsent).toBeTruthy();
	});

	it('pi should successfully approve application', async (): Promise<any> => {
		await ProjectOverview.navigateToPIApproval();
		await FormularPage.approveByPI();
		const mailPresent: boolean = await ProjectOverview.checkForPIApproval();
		expect(mailPresent).toBeTruthy();
	});

	it('should remove the application', async (): Promise<any> => {
		await ProjectOverview.removeApplication();
	});
});
