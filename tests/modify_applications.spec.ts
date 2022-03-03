import { test } from '@playwright/test';
import { FACILITY_MANAGER_STORAGE, MEMBER_STORAGE, VO_MANAGER_STORAGE } from './global-setup';
import { FormularPage } from './page_objects/formular.po';
import { ApplicationOverviewPage } from './page_objects/application_overview.po';
import { VoOverviewPage } from './page_objects/vo_overview.po';
import { FacilityApplicationOverviewPage } from './page_objects/facility_application_overview.po';
import { Util } from './util';
import {ProjectOverViewPage} from "./page_objects/project_overview.po";

test.describe.serial('@openstack_modifications', () => {

	test.describe('Should request a project extension for OpenStack', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @openstack_application', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToOpenStackProjectOverview();
			await projectOverviewPage.requestProjectExtension(false);
		});
	});

	test.describe('Should request a project modification for OpenStack', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @openstack_application', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToOpenStackProjectOverview();
			await projectOverviewPage.requestProjectModification(false);
		});
	});

	test.describe('Should approve a project extension for OpenStack', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @openstack_application', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveOpenStackExtensionRequest(Util.OPENSTACK_APPLICATION_NAME);
		});
	});

	test.describe('Should approve a project modification for OpenStack', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @openstack_application', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveOpenStackModificationRequest(Util.OPENSTACK_APPLICATION_NAME);
		});
	});

	test.describe('Should approve an openstack extension request', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });
		test('FM @openstack_application', async ({ page, baseURL }) => {
			const facilityApplicationOverviewPage = new FacilityApplicationOverviewPage(page, baseURL);
			await facilityApplicationOverviewPage.approveApplicationExtension(Util.OPENSTACK_APPLICATION_NAME);
		});
	});

	test.describe('Should approve an openstack modification request', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });
		test('FM @openstack_application', async ({ page, baseURL }) => {
			const facilityApplicationOverviewPage = new FacilityApplicationOverviewPage(page, baseURL);
			await facilityApplicationOverviewPage.approveApplicationModification(Util.OPENSTACK_APPLICATION_NAME);
		});
	});

});

test.describe.serial('@simpleVM_modifications', () => {

	test.describe('Should request a project extension for SimpleVM', () => {
		test.use({storageState: MEMBER_STORAGE});
		test('Member @simple_vm_application', async ({page, baseURL}) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToSimpleVMProjectOverview();
			await projectOverviewPage.requestProjectExtension(true);
		});
	});

	test.describe('Should request a modification request for SimpleVM', () => {
		test.use({storageState: MEMBER_STORAGE});
		test('Member @simple_vm_application', async ({page, baseURL}) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToSimpleVMProjectOverview();
			await projectOverviewPage.requestProjectModification(true);
		});
	});

	test.describe('Should approve a project extension for SimpleVM', () => {
		test.use({storageState: VO_MANAGER_STORAGE});
		test('VO @simple_vm_application', async ({page, baseURL}) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveSimpleVMExtensionRequest(Util.SIMPLE_VM_APPLICATION_NAME);
		});
	});

	test.describe('Should approve a project modification for SimpleVM', () => {
		test.use({storageState: VO_MANAGER_STORAGE});
		test('VO @simple_vm_application', async ({page, baseURL}) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveSimpleVMModificationRequest(Util.SIMPLE_VM_APPLICATION_NAME);
		});
	});

});
