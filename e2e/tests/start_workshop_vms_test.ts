import { browser } from 'protractor';
import { LoginPage } from '../page_objects/login.po';
import { WorkshopVMPage } from '../page_objects/workshop_vm.po';
import { Util } from '../util';
import { VMOverviewPage } from '../page_objects/vm_overview.po';
import { WorkshopOverviewPage } from '../page_objects/workshop_overview.po';

describe('Workshop VM Test', (): void => {

	const vmOverviewPage: VMOverviewPage = new VMOverviewPage();

	beforeAll(async (): Promise<any> => {
		await browser.waitForAngularEnabled(false);
		await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
	});

	it('Should start workshop vms', async (): Promise<any> => {
		Util.logInfo('Starting workshop vm for user and admin');
		await WorkshopVMPage.navigateToAddWorkshopVm();
		await WorkshopVMPage.selectProject();
		await WorkshopVMPage.selectWorkshop();
		await WorkshopVMPage.startVMsForUserAndAdmin();
		await WorkshopVMPage.isRedirectModalPresent();
		await Util.waitForPage('/virtualmachines/vmOverview');
	});

	it('Should become active', async (): Promise<any> => {
		Util.logInfo('Wating until vms become active');
		await browser.sleep(5000);
		const workshopMachines: string[] = await VMOverviewPage.getAllWorkshopMachines();
		Util.logInfo(`Number of machines found: ${workshopMachines.length}`);
		expect(workshopMachines.length).toBe(2);
		const results: any[] = [];
		for (const workshopMachine of workshopMachines) {
			Util.logInfo(`Wating for ${workshopMachine}`);
			// eslint-disable-next-line no-await-in-loop
			results.push(vmOverviewPage.isVmActive(workshopMachine));
		}

		await Promise.all(results);
		for (const result of results) {
			expect(result).toBeTruthy();
		}
	});

	it('Should appear on workshop overview', async (): Promise<any> => {
		await WorkshopOverviewPage.navigateToOverview();
		await WorkshopOverviewPage.selectProject();
		await WorkshopOverviewPage.selectWorkshop();
		await WorkshopOverviewPage.workshopHasVms();
	});

	it('Should login to resenv', async (): Promise<any> => {
		const resenvUrlAdmin: string = await WorkshopOverviewPage.getResenvUrlOfAdmin();
		const resenvUrlUser = await WorkshopOverviewPage.getResenvUrlOfUser();
		await browser.driver.get(resenvUrlAdmin);
		await Util.waitForElementToBeClickableByName('continue');
		await Util.clickElementByName('continue');
		expect(await browser.getTitle()).toEqual('CWLab');
		await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
		await browser.driver.get(resenvUrlUser);
		await Util.waitForElementToBeClickableByName('continue');
		await Util.clickElementByName('continue');
		expect(await browser.getTitle()).toEqual('CWLab');
	});

});
