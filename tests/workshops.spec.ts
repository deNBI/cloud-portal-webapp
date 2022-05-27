import { test } from '@playwright/test';
// @ts-ignore
import environment from './environment.json';
import { MEMBER_STORAGE, VO_MANAGER_STORAGE } from './global-setup';
import { Util } from './util';
import { ApplicationOverviewPage } from './page_objects/application_overview.po';
import { VoOverviewPage } from './page_objects/vo_overview.po';
import { WorkshopOverviewPage } from './page_objects/workshop_overview.po';
import { InstanceOverviewPage } from './page_objects/instance_overview.po';
import { WorkshopInstancesPage } from './page_objects/workshop_instances.po';
import { ProjectOverViewPage } from './page_objects/project_overview.po';
import { FormularPage } from './page_objects/formular.po';

test.describe.serial('@workshops', () => {
	test.describe('Should delete old workshop applications', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @workshops', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineApplications(Util.WORKSHOP_PROJECT_NAME);
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateSimpleVMProjects(Util.WORKSHOP_PROJECT_NAME);
		});
	});

	test.describe('Should request a workshop application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @workshops', async ({ page, baseURL }) => {
			const formularPage = new FormularPage(page, baseURL);
			await formularPage.goToNewSimpleVMProject();
			await formularPage.fillApplicationFormular(Util.WORKSHOP_PROJECT_NAME, true, false);
			await formularPage.submitApplication();
		});
	});

	test.describe('Should approve a workshop application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @workshops', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveSimpleVm(Util.WORKSHOP_PROJECT_NAME);
		});
	});

	test.describe('Should add a member to workshop application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @workshops', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToProjectOverview(Util.WORKSHOP_PROJECT_NAME);
			await projectOverviewPage.addMember(environment.email_fm);
		});
	});

	test.describe('Should create a workshop', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @workshops', async ({ page, baseURL }) => {
			const workshopOverviewPage = new WorkshopOverviewPage(page, baseURL);
			await workshopOverviewPage.goToWorkshopOverview();
			await workshopOverviewPage.selectProject();
			await workshopOverviewPage.createNewWorkshopWithSuccess();
			await workshopOverviewPage.createNewWorkshopWithError();
		});
	});

	test.describe('Should have users', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @workshops', async ({ page, baseURL }) => {
			const workshopOverviewPage = new WorkshopOverviewPage(page, baseURL);
			await workshopOverviewPage.goToWorkshopOverview();
			await workshopOverviewPage.selectProject();
			await workshopOverviewPage.selectWorkshop();
			await workshopOverviewPage.userIsAdmin(environment.elixir_id_user);
			await workshopOverviewPage.userIsParticipant(environment.elixir_id_fm);
		});
	});

	test.describe('Should start workshop vms', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @workshops', async ({ page, baseURL }) => {
			const workshopInstancesPage = new WorkshopInstancesPage(page, baseURL);
			await workshopInstancesPage.goToWorkshopInstances();
			await workshopInstancesPage.selectProject();
			await workshopInstancesPage.selectWorkshop();
			await workshopInstancesPage.startVMsForUsers([environment.elixir_id_user, environment.elixir_id_fm]);
		});
	});

	test.describe('Should have vms active', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @workshops', async ({ page, baseURL }) => {
			const vmOverviewPage = new InstanceOverviewPage(page, baseURL);
			await vmOverviewPage.goto();
			const workshopMachines: string[] = await vmOverviewPage.expectWorkshopMachines(2);
			const results: any[] = [];
			for (const workshopMachine of workshopMachines) {
				console.log(`Wating for ${workshopMachine}`);
				// eslint-disable-next-line no-await-in-loop
				results.push(vmOverviewPage.waitForInstanceToBeActive(workshopMachine.trim(), Util.MIN_TIMEOUT_30));
			}

			await Promise.all(results);
		});
	});

	test.describe('Should have instances on workshop overview', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @workshops', async ({ page, baseURL }) => {
			const workshopOverviewPage = new WorkshopOverviewPage(page, baseURL);
			await workshopOverviewPage.goToWorkshopOverview();
			await workshopOverviewPage.selectProject();
			await workshopOverviewPage.selectWorkshop();
			await workshopOverviewPage.workshopHasVms([environment.elixir_id_user, environment.elixir_id_fm]);
		});
	});

	test.describe('Should login to resenv', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member and Admin @workshops', async ({ page, baseURL }) => {
			const workshopOverviewPage = new WorkshopOverviewPage(page, baseURL);
			await page.waitForTimeout(2000);
			await workshopOverviewPage.goToWorkshopOverview();
			await workshopOverviewPage.selectProject();
			await workshopOverviewPage.selectWorkshop();
			const resenv_url_admin = await workshopOverviewPage.getResenvUrlOfUser(environment.elixir_id_user);
			await workshopOverviewPage.visitResEnv(resenv_url_admin, 'CWLab');
		});
	});

	test.describe('Should cleanup a workshop', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @workshops', async ({ page, baseURL }) => {
			const workshopOverviewPage = new WorkshopOverviewPage(page, baseURL);
			await workshopOverviewPage.goToWorkshopOverview();
			await workshopOverviewPage.selectProject();
			await workshopOverviewPage.selectWorkshop();
			await workshopOverviewPage.deleteWorkshop();
		});
	});

	test.describe('Aftercare - Should delete old workshop applications', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test.setTimeout(Util.MIN_TIMEOUT_1);
		test('VO @workshops', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineApplications(Util.WORKSHOP_PROJECT_NAME);
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateSimpleVMProjects(Util.WORKSHOP_PROJECT_NAME);
		});
	});
});
