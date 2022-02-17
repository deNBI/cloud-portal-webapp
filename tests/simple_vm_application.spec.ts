import { test } from '@playwright/test';
import { MEMBER_STORAGE, VO_MANAGER_STORAGE } from './global-setup';
import { FormularPage } from './page_objects/formular.po';
import { Util } from './util';
import { ApplicationOverviewPage } from './page_objects/application_overview.po';
import { VoOverviewPage } from './page_objects/vo_overview.po';
import { ProjectOverViewPage } from './page_objects/project_overview.po';

test.describe.serial('Should delete old simple_vm applications - VO @simple_vm_application @all', () => {
	test.describe('Should delete old simple_vm applications - VO @simple_vm_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });

		test('Should cleanup old  simple_vm applications - VO', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineSimpleVmApplications();
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateAllSimpleVMPTPprojects();
		});
	});

	test.describe('Should request an simple_vm_application - Member @simple_vm_application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Should request a new simple_vm application', async ({ page, baseURL }) => {
			const formularPage = new FormularPage(page, baseURL);
			await formularPage.goToNewSimpleVMProject();
			await formularPage.fillApplicationFormular(Util.SIMPLE_VM_APPLICATION_NAME, true, false);
			await formularPage.submitApplication();
		});
	});
	test.describe('Should approve an simple_vm_application - VO @simple_vm_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('Should approve simple_vm_application', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveSimpleVm(Util.SIMPLE_VM_APPLICATION_NAME);
		});
	});
	test.describe('Should request a project extension for SimpleVM - Member @simple_vm_application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Should request a project extension for SimpleVM', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToSimpleVMProjectOverview();
			await projectOverviewPage.requestProjectExtension(true);
		});
	});
	test.describe('Should request a modification request for SimpleVM - Member @simple_vm_application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Should request a project modification for SimpleVM', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToSimpleVMProjectOverview();
			await projectOverviewPage.requestProjectModification(true);
		});
	});
	test.describe('Should approve a project extension for SimpleVM - VO @simple_vm_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('Should approve a project extension for SimpleVM', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveSimpleVMExtensionRequest(Util.SIMPLE_VM_APPLICATION_NAME);
		});
	});
	test.describe('Should approve a project modification for SimpleVM - VO @simple_vm_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('Should approve a project modification for SimpleVM', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveSimpleVMModificationRequest(Util.SIMPLE_VM_APPLICATION_NAME);
		});
	});
	test.describe('Should request a termination request for SimpleVM - Member @simple_vm_application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Should request a project termination for SimpleVM', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToSimpleVMProjectOverview();
			await projectOverviewPage.requestTermination();
		});
	});
	test.describe('Aftercare - Should delete old simple_vm_application - VO @simple_vm_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });

		test('Should cleanup simple_vm_application - VO', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineSimpleVmApplications();
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateAllSimpleVMPTPprojects();
		});
	});
});
