import { browser } from 'protractor';
import { LoginPage } from '../page_objects/login.po';
import { WorkshopOverviewPage } from '../page_objects/workshop_overview.po';
import { Util } from '../util';

describe('Workshop creation test', (): void => {

	beforeAll(async (): Promise<any> => {
		await browser.waitForAngularEnabled(false);
		await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
	});

	it('Should create a Workshop', async (): Promise<any> => {
		Util.logDebug('Testing creation of new workshop');
		await WorkshopOverviewPage.navigateToOverview();
		Util.logDebug('Creating new Workshop');
		await WorkshopOverviewPage.createNewWorkshop();
		Util.logInfo('Checking if new workshop successful');
		const workshopSuccess: boolean = await WorkshopOverviewPage.newWorkshopSuccess();
		expect(workshopSuccess).toBeTruthy();

		Util.logInfo('Checking if new workshop failing');
		const workshopError: boolean = await WorkshopOverviewPage.newWorkshopError();
		expect(workshopError).toBeTruthy();
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
