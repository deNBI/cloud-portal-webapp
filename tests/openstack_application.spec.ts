import {
	test,
} from '@playwright/test';
import { FACILITY_MANAGER_STORAGE, MEMBER_STORAGE, VO_MANAGER_STORAGE } from './global-setup';
import { FormularPage } from './page_objects/formular.po';
import { ApplicationOverviewPage } from './page_objects/application_overview.po';
import { VoOverviewPage } from './page_objects/vo_overview.po';
import { FacilityApplicationOverviewPage } from './page_objects/facility_application_overview.po';
import { Util } from './util';

test.describe.serial('Should delete old openstack applications - VO @openstack_application @all', () => {

	test.describe('Should delete old openstack applications - VO @openstack_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });

		test('Should cleanup old applications - VO', async ({ page }) => {

			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page);
			await applicationPage.declineOpenStackApplications();
			const voOverviewPage = new VoOverviewPage(page);
			await voOverviewPage.terminateAllOpenStackPTPRojects();

		});

	});

	test.describe('Should delete old openstack applications - FM @openstack_application', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });

		test('Should cleanup old applications - FM', async ({ page }) => {

			test.setTimeout(60 * 1000);

			const facilityApplicationOverviewPage = new FacilityApplicationOverviewPage(page);
			await facilityApplicationOverviewPage.terminatePTApplications();

		});

	});

	test.describe('Should request an openstack application - Member @openstack_application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Should request a new openstack application', async ({ page }) => {
			const formularPage = new FormularPage(page);
			await formularPage.goToNewOpenStackApplication();
			await formularPage.fillApplicationFormular(Util.OPENSTACK_APPLICATION_NAME, true, true);
			await formularPage.submitApplication();

		});
	});
	test.describe('Should approve an openstack application - VO @openstack_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('Should approve openstack application', async ({ page }) => {
			const applicationPage = new ApplicationOverviewPage(page);
			await applicationPage.approveOpenStackApplication(Util.OPENSTACK_APPLICATION_NAME);

		});

	});
	test.describe('Should approve an openstack application - FM @openstack_application', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });
		test('Should approve openstack application', async ({ page }) => {

			const facilityApplicationOverviewPage = new FacilityApplicationOverviewPage(page);
			await facilityApplicationOverviewPage.approveApplication(Util.OPENSTACK_APPLICATION_NAME);

		});

	});
	test.describe('Aftercare - Should delete old openstack applications - VO @openstack_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });

		test('Should cleanup old applications - VO', async ({ page }) => {

			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page);
			await applicationPage.declineOpenStackApplications();
			const voOverviewPage = new VoOverviewPage(page);
			await voOverviewPage.terminateAllOpenStackPTPRojects();

		});

	});

	test.describe('Aftercare - Should delete old openstack applications - FM @openstack_application', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });

		test('Should cleanup old applications - FM', async ({ page }) => {

			test.setTimeout(60 * 1000);

			const facilityApplicationOverviewPage = new FacilityApplicationOverviewPage(page);
			await facilityApplicationOverviewPage.terminatePTApplications();

		});

	});
});
