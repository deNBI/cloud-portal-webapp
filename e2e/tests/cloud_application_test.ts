// spec.js
import { browser } from 'protractor';
import { LoginPage } from '../page_objects/login.po';
import { FormularPage } from '../page_objects/application_formular.po';
import { Util } from '../util';
import { ProjectOverview } from '../page_objects/project_overview.po';

describe('Cloud Application Test', (): void => {

	beforeAll(async (): Promise<any> => {
		await browser.waitForAngularEnabled(false);
		await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
	});

	it('should navigate to cloud application form', async (): Promise<any> => {
		Util.logInfo('Starting send a cloud  application test!');
		await FormularPage.navigateToCloudApplication();
	});

	it('should fill cloud application form', async (): Promise<any> => {
		await FormularPage.fillApplicationFormular(Util.OPENSTACK_APPLICATION_NAME, true);
	});

	it('should submit cloud application ', async (): Promise<any> => {
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

	it('should have Bioinformatics in the research topics', async (): Promise<any> => {
		await ProjectOverview.isBioinformaticsSet();
	});

	it('should have dissemination ', async (): Promise<any> => {
		await ProjectOverview.isDisseminationSet();
	});

});
