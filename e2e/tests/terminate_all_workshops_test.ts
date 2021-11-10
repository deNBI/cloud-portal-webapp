import { browser } from 'protractor';
import { LoginPage } from '../page_objects/login.po';
import { WorkshopOverviewPage } from '../page_objects/workshop_overview.po';
import { Util } from '../util';

describe('Workshop deletion test', (): void => {

	beforeAll(async (): Promise<any> => {
		await browser.waitForAngularEnabled(false);
		await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
	});

	it('Should delete a Workshop', async (): Promise<any> => {
		Util.logDebug('Testing deletion of workshop');
		await WorkshopOverviewPage.navigateToOverview();
		Util.logDebug('Deleting Workshop');
		const deletionSuccess: boolean = await WorkshopOverviewPage.deleteWorkshop();
		Util.logInfo('Checking if workshop deletion successful');
		expect(deletionSuccess).toBeTruthy();
		await WorkshopOverviewPage.closeWorkshopCleanupModal();
	});

});
