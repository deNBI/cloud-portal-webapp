import {
	test,
} from '@playwright/test';
import { FACILITY_MANAGER_STORAGE, MEMBER_STORAGE, VO_MANAGER_STORAGE } from './global-setup';
import { FormularPage } from './page_objects/formular.po';
import { ApplicationOverviewPage } from './page_objects/application_overview.po';
import { VoOverviewPage } from './page_objects/vo_overview.po';
import { FacilityApplicationOverviewPage } from './page_objects/facility_application_overview.po';
import { Util } from './util';
import { ProjectOverViewPage } from './page_objects/project_overview.po';

test.describe.serial('Should delete old openstack applications - VO @openstack_application @all', () => {

	test.describe('Should delete old openstack applications - VO @openstack_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });

		test('Should cleanup old applications - VO', async ({ page, baseURL }) => {

			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineOpenStackApplications();
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateAllOpenStackPTPRojects();

		});

	});

	test.describe('Should delete old openstack applications - FM @openstack_application', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });

		test('Should cleanup old applications - FM', async ({ page, baseURL }) => {

			test.setTimeout(60 * 1000);

			const facilityApplicationOverviewPage = new FacilityApplicationOverviewPage(page, baseURL);
			await facilityApplicationOverviewPage.terminatePTApplications();

		});

	});

	test.describe('Should request an openstack application - Member @openstack_application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Should request a new openstack application', async ({ page, baseURL }) => {
			const formularPage = new FormularPage(page, baseURL);
			await formularPage.goToNewOpenStackApplication();
			await formularPage.fillApplicationFormular(Util.OPENSTACK_APPLICATION_NAME, true, true);
			await formularPage.submitApplication();

		});
	});
	test.describe('Should approve an openstack application - VO @openstack_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('Should approve openstack application', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveOpenStackApplication(Util.OPENSTACK_APPLICATION_NAME);

		});

	});
	test.describe('Should approve an openstack application - FM @openstack_application', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });
		test('Should approve openstack application', async ({ page, baseURL }) => {

			const facilityApplicationOverviewPage = new FacilityApplicationOverviewPage(page, baseURL);
			await facilityApplicationOverviewPage.approveApplication(Util.OPENSTACK_APPLICATION_NAME);

		});

	});

	test.describe('Should request a project extension for OpenStack - Member @openstack_application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Should request a project extension for SimpleVM', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToOpenStackProjectOverview();
			await projectOverviewPage.requestProjectExtension(false);
		});
	});

	test.describe('Should request a project modification for OpenStack - Member @openstack_application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Should request a project extension for SimpleVM', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToOpenStackProjectOverview();
			await projectOverviewPage.requestProjectModification(false);
		});
	});


	test.describe('Should approve the VO part of a project extension for OpenStack - VO @openstack_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('Should approve a project extension for OpenStack - VO part', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveOpenStackExtensionRequest(Util.OPENSTACK_APPLICATION_NAME);
		});
	});

	test.describe('Should approve the VO part of a project modification for OpenStack - VO @openstack_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('Should approve a project modification for OpenStack - VO part', async ({ page, baseURL }) => {
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.approveOpenStackModificationRequest(Util.SIMPLE_VM_APPLICATION_NAME);
		});
	});

	test.describe('Should approve an openstack extension request - FM @openstack_application', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });
		test('Should approve openstack extension', async ({ page, baseURL }) => {
			const facilityApplicationOverviewPage = new FacilityApplicationOverviewPage(page, baseURL);
			await facilityApplicationOverviewPage.approveApplicationExtension(Util.OPENSTACK_APPLICATION_NAME);
		});
	});

	test.describe('Should approve an openstack modification request - FM @openstack_application', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });
		test('Should approve openstack modification', async ({ page, baseURL }) => {
			const facilityApplicationOverviewPage = new FacilityApplicationOverviewPage(page, baseURL);
			await facilityApplicationOverviewPage.approveApplicationModification(Util.OPENSTACK_APPLICATION_NAME);
		});
	});


	test.describe('Should request a project termination for OpenStack - Member @openstack_application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Should request a project extension for SimpleVM', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToOpenStackProjectOverview();
			await projectOverviewPage.requestTermination();
		});
	});
	test.describe('Aftercare - Should delete old openstack applications - VO @openstack_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });

		test('Should cleanup old applications - VO', async ({ page, baseURL }) => {

			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineOpenStackApplications();
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateAllOpenStackPTPRojects();

		});

	});

	test.describe('Aftercare - Should delete old openstack applications - FM @openstack_application', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });

		test('Should cleanup old applications - FM', async ({ page, baseURL }) => {

			test.setTimeout(60 * 1000);

			const facilityApplicationOverviewPage = new FacilityApplicationOverviewPage(page, baseURL);
			await facilityApplicationOverviewPage.terminatePTApplications();

		});

	});
});
