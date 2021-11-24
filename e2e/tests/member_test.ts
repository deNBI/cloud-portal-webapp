// spec.js
import { browser } from 'protractor';
import { LoginPage } from '../page_objects/login.po';
import { Util } from '../util';
import { ProjectOverview } from '../page_objects/project_overview.po';

describe('Member Test', (): void => {

	beforeAll(async (): Promise<any> => {
		await browser.waitForAngularEnabled(false);
		await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
	});

	it('should navigate to project overview', async (): Promise<any> => {
		await ProjectOverview.navigateToSimpleProjectverview();
	});

	it('should add member', async (): Promise<any> => {
		await ProjectOverview.addMemberToProject(Util.SIMPLE_VM_APPLICATION_NAME);
	});

	it('should remove member', async (): Promise<any> => {
		await ProjectOverview.removeMemberFromProject(Util.SIMPLE_VM_APPLICATION_NAME);
	});

});
