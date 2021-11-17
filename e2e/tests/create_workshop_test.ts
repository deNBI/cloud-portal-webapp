import { browser } from 'protractor';
import { LoginPage } from '../page_objects/login.po';
import { WorkshopOverviewPage } from '../page_objects/workshop_overview.po';
import { Util } from '../util';
import { ProjectOverview } from '../page_objects/project_overview.po';

describe('Workshop creation test', (): void => {

	beforeAll(async (): Promise<any> => {
		await browser.waitForAngularEnabled(false);
		await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
	});

	it('Should create a Workshop', async (): Promise<any> => {
		Util.logInfo('Adding user to Project');
		await ProjectOverview.navigateToSimpleProjectverview();
		await ProjectOverview.addMemberToProject(Util.SIMPLE_VM_APPLICATION_NAME);
		Util.logDebug('Testing creation of new workshop');
		await WorkshopOverviewPage.navigateToOverview();
		await WorkshopOverviewPage.selectProject();
		Util.logDebug('Creating new Workshop');
		await WorkshopOverviewPage.createNewWorkshop();
		Util.logInfo('Checking if new workshop successful');
		const workshopSuccess: boolean = await WorkshopOverviewPage.newWorkshopSuccess();
		expect(workshopSuccess).toBeTruthy();
		await WorkshopOverviewPage.closeCreationStatusModal();

		Util.logInfo('Checking if new workshop failing');
		Util.logDebug('Creating new Workshop again');
		await WorkshopOverviewPage.createNewWorkshop();
		const workshopError: boolean = await WorkshopOverviewPage.newWorkshopError();
		expect(workshopError).toBeTruthy();
		await WorkshopOverviewPage.closeCreationStatusModal();
	});

	it('Should has Users', async (): Promise<any> => {
		Util.logInfo('Checking if User exists');
		const hasUser: boolean = await WorkshopOverviewPage.workshopHasUser();
		expect(hasUser).toBeTruthy();
		Util.logInfo('Checking if Admin exists');
		const hasAdmin: boolean = await WorkshopOverviewPage.workshopHasAdmin();
		expect(hasAdmin).toBeTruthy();
	});

});
