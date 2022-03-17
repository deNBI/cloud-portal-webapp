import { test } from '@playwright/test';
import { MEMBER_STORAGE, VO_MANAGER_STORAGE } from './global-setup';
import { FormularPage } from './page_objects/formular.po';
import { ApplicationOverviewPage } from './page_objects/application_overview.po';
import { VoOverviewPage } from './page_objects/vo_overview.po';
import { Util } from './util';
import { ProjectOverViewPage } from './page_objects/project_overview.po';

test.describe.serial('@simple_vm_application', () => {
	test.describe('Should delete old simple_vm applications', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @simple_vm_application', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineApplications(Util.SIMPLE_VM_APPLICATION_NAME);
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateSimpleVMProjects(Util.SIMPLE_VM_APPLICATION_NAME);
		});
	});

	test.describe('Should request a simple_vm_application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @simple_vm_application', async ({ page, baseURL }) => {
			const formularPage = new FormularPage(page, baseURL);
			await formularPage.goToNewSimpleVMProject();
			await formularPage.fillApplicationFormular(Util.SIMPLE_VM_APPLICATION_NAME, true, false);
			await formularPage.submitApplication();
		});
	});

	test.describe('Should approve a simple_vm_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @simple_vm_application', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveSimpleVm(Util.SIMPLE_VM_APPLICATION_NAME);
		});
	});

	test.describe('Should request a project extension for SimpleVM', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @simple_vm_application', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToProjectOverview(Util.SIMPLE_VM_APPLICATION_NAME);
			await projectOverviewPage.requestProjectExtension(true);
		});
	});

	test.describe('Should request a modification request for SimpleVM', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @simple_vm_application', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToProjectOverview(Util.SIMPLE_VM_APPLICATION_NAME);
			await projectOverviewPage.requestProjectModification(true);
		});
	});

	test.describe('Should approve a project extension for SimpleVM', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @simple_vm_application', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveSimpleVMExtensionRequest(Util.SIMPLE_VM_APPLICATION_NAME);
		});
	});

	test.describe('Should approve a project modification for SimpleVM', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @simple_vm_application', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveSimpleVMModificationRequest(Util.SIMPLE_VM_APPLICATION_NAME);
		});
	});

	test.describe('Aftercare - Should delete old simple_vm_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @simple_vm_application', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineApplications(Util.SIMPLE_VM_APPLICATION_NAME);
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateSimpleVMProjects(Util.SIMPLE_VM_APPLICATION_NAME);
		});
	});
});
