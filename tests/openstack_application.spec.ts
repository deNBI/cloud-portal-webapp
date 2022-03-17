import { test } from '@playwright/test';
import { FACILITY_MANAGER_STORAGE, MEMBER_STORAGE, VO_MANAGER_STORAGE } from './global-setup';
import { FormularPage } from './page_objects/formular.po';
import { ApplicationOverviewPage } from './page_objects/application_overview.po';
import { VoOverviewPage } from './page_objects/vo_overview.po';
import { FacilityApplicationOverviewPage } from './page_objects/facility_application_overview.po';
import { Util } from './util';
import { ProjectOverViewPage } from './page_objects/project_overview.po';

test.describe.serial('@openstack_application', () => {
	test.describe('Should delete old openstack applications', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @openstack_application', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineApplications(Util.OPENSTACK_APPLICATION_NAME);
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateOpenStackProjects(Util.OPENSTACK_APPLICATION_NAME);
		});
	});

	test.describe('Should delete old openstack applications', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });
		test('FM @openstack_application', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const facilityApplicationOverviewPage = new FacilityApplicationOverviewPage(page, baseURL);
			await facilityApplicationOverviewPage.terminateApplications(Util.OPENSTACK_APPLICATION_NAME);
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

	test.describe('Should request a project extension for OpenStack', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @openstack_application', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToProjectOverview(Util.OPENSTACK_APPLICATION_NAME);
			await projectOverviewPage.requestProjectExtension(false);
		});
	});

	test.describe('Should request a project modification for OpenStack', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @openstack_application', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToProjectOverview(Util.OPENSTACK_APPLICATION_NAME);
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

	test.describe('Aftercare - Should delete old openstack applications', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @openstack_application', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineApplications(Util.OPENSTACK_APPLICATION_NAME);
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateOpenStackProjects(Util.OPENSTACK_APPLICATION_NAME);
		});
	});

	test.describe('Aftercare - Should delete old openstack applications', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });
		test('FM @openstack_application', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const facilityApplicationOverviewPage = new FacilityApplicationOverviewPage(page, baseURL);
			await facilityApplicationOverviewPage.terminateApplications(Util.OPENSTACK_APPLICATION_NAME);
		});
	});
});
