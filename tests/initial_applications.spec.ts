import { test } from '@playwright/test';
import { FACILITY_MANAGER_STORAGE, MEMBER_STORAGE, VO_MANAGER_STORAGE } from './global-setup';
import { FormularPage } from './page_objects/formular.po';
import { ApplicationOverviewPage } from './page_objects/application_overview.po';
import { VoOverviewPage } from './page_objects/vo_overview.po';
import { FacilityApplicationOverviewPage } from './page_objects/facility_application_overview.po';
import { Util } from './util';

test.describe.serial('@openstack_application', () => {

	test.describe('Should delete old openstack applications', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @openstack_application', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineOpenStackApplications();
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateAllOpenStackPTPRojects();
		});
	});

	test.describe('Should delete old openstack applications', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });
		test('FM @openstack_application', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const facilityApplicationOverviewPage = new FacilityApplicationOverviewPage(page, baseURL);
			await facilityApplicationOverviewPage.terminatePTApplications();
		});
	});

	test.describe('Should request an openstack application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @openstack_application', async ({ page, baseURL }) => {
			const formularPage = new FormularPage(page, baseURL);
			await formularPage.goToNewOpenStackApplication();
			await formularPage.fillApplicationFormular(Util.OPENSTACK_APPLICATION_NAME, true, true);
			await formularPage.submitApplication();
		});
	});

	test.describe('Should approve an openstack application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @openstack_application', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveOpenStackApplication(Util.OPENSTACK_APPLICATION_NAME);
		});
	});

	test.describe('Should approve an openstack application', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });
		test('FM @openstack_application', async ({ page, baseURL }) => {
			const applicationPage = new FacilityApplicationOverviewPage(page, baseURL);
			await applicationPage.approveApplication(Util.OPENSTACK_APPLICATION_NAME);
		});
	});

});

test.describe.serial('@simple_vm_application', () => {

	test.describe('Should delete old simple_vm applications', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @simple_vm_application', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineSimpleVmApplications();
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateAllSimpleVMPTPprojects();
		});
	});

	test.describe('Should request an simple_vm_application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @simple_vm_application', async ({ page, baseURL }) => {
			const formularPage = new FormularPage(page, baseURL);
			await formularPage.goToNewSimpleVMProject();
			await formularPage.fillApplicationFormular(Util.SIMPLE_VM_APPLICATION_NAME, true, false);
			await formularPage.submitApplication();
		});
	});

	test.describe('Should approve an simple_vm_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @simple_vm_application', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveSimpleVm(Util.SIMPLE_VM_APPLICATION_NAME);
		});
	});

});
