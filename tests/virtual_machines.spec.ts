import { test } from '@playwright/test';
import { MEMBER_STORAGE, VO_MANAGER_STORAGE } from './global-setup';
import { NewInstancePage } from './page_objects/new_instance.po';
import { Util } from './util';
import { InstanceOverviewPage } from './page_objects/instance_overview.po';
import { ApplicationOverviewPage } from './page_objects/application_overview.po';
import { VoOverviewPage } from './page_objects/vo_overview.po';
import { FormularPage } from './page_objects/formular.po';

test.describe.serial('@instances', () => {
	test.describe('Should delete old simple_vm_instances applications', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @instances', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineApplications(Util.INSTANCES_PROJECT_NAME);
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateSimpleVMProjects(Util.INSTANCES_PROJECT_NAME);
		});
	});

	test.describe('Should request a simple_vm_instances application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @instances', async ({ page, baseURL }) => {
			const formularPage = new FormularPage(page, baseURL);
			await formularPage.goToNewSimpleVMProject();
			await formularPage.fillApplicationFormular(Util.INSTANCES_PROJECT_NAME, true, false);
			await formularPage.submitApplication();
		});
	});

	test.describe('Should approve a simple_vm_instances application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @instances', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveSimpleVm(Util.INSTANCES_PROJECT_NAME);
		});
	});

	test.describe('Should start a VM without volume', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @instances', async ({ page, baseURL }) => {
			const addVMPage = new NewInstancePage(page, baseURL);
			await addVMPage.goto();
			await addVMPage.selectProject(Util.INSTANCES_PROJECT_NAME);
			await addVMPage.startNormalVM(Util.INSTANCES_PROJECT_NAME, Util.BASIC_VM_NAME, false);
		});
	});

	test.describe('Should start a VM with volume', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @instances', async ({ page, baseURL }) => {
			const addVMPage = new NewInstancePage(page, baseURL);
			await addVMPage.goto();
			await addVMPage.selectProject(Util.INSTANCES_PROJECT_NAME);
			await addVMPage.startNormalVM(Util.INSTANCES_PROJECT_NAME, Util.VOLUME_VM_NAME, true);
		});
	});

	test.describe('Should start a VM with resenv', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @instances', async ({ page, baseURL }) => {
			const addVMPage = new NewInstancePage(page, baseURL);
			await addVMPage.goto();
			await addVMPage.selectProject(Util.INSTANCES_PROJECT_NAME);
			await addVMPage.startNormalVM(Util.INSTANCES_PROJECT_NAME, Util.RESENV_VM_NAME, false, true);
		});
	});

	test.describe('Should see basic VM as active in instance overview', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @instances', async ({ page, baseURL }) => {
			const vmOverviewPage = new InstanceOverviewPage(page, baseURL);
			await vmOverviewPage.goto();
			await vmOverviewPage.waitForInstanceToBeActive(Util.BASIC_VM_NAME);
		});
	});

	test.describe('Should see volume VM as active with volume attached in instance overview', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @instances', async ({ page, baseURL }) => {
			const vmOverviewPage = new InstanceOverviewPage(page, baseURL);
			await vmOverviewPage.goto();
			await vmOverviewPage.waitForInstanceToBeActive(Util.VOLUME_VM_NAME);
			await vmOverviewPage.waitForInstanceToHaveVolumeAttached(Util.VOLUME_VM_NAME);
		});
	});

	test.describe('Should see resenv VM as active with resenv in instance overview', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test.setTimeout(Util.MIN_TIMEOUT_15);
		test('Member @instances', async ({ page, baseURL }) => {
			const vmOverviewPage = new InstanceOverviewPage(page, baseURL);
			await vmOverviewPage.goto();
			await vmOverviewPage.waitForInstanceToBeActive(Util.RESENV_VM_NAME, 60000 * 3);
			await vmOverviewPage.waitForInstanceToHaveResenv(Util.RESENV_VM_NAME);
		});
	});

	test.describe('Should stop basic active VM', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @instances', async ({ page, baseURL }) => {
			const vmOverviewPage = new InstanceOverviewPage(page, baseURL);
			await vmOverviewPage.goto();
			await vmOverviewPage.waitForInstanceToBeActive(Util.RESENV_VM_NAME, 60000 * 3);
			await vmOverviewPage.stopVirtualMachine(Util.BASIC_VM_NAME);
		});
	});

	test.describe('Should resume basic active VM', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @instances', async ({ page, baseURL }) => {
			const vmOverviewPage = new InstanceOverviewPage(page, baseURL);
			await vmOverviewPage.goto();
			await vmOverviewPage.waitForInstanceToBeShutoff(Util.RESENV_VM_NAME, 60000 * 1);
			await vmOverviewPage.resumeVirtualMachine(Util.BASIC_VM_NAME);
		});
	});

	test.describe('Aftercare - Should delete old simple_vm_instances applications', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @simple_vm_application', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineApplications(Util.INSTANCES_PROJECT_NAME);
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateSimpleVMProjects(Util.INSTANCES_PROJECT_NAME);

		});
	});
});
