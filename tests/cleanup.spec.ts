import { test } from '@playwright/test';
import { FACILITY_MANAGER_STORAGE, MEMBER_STORAGE, VO_MANAGER_STORAGE } from './global-setup';
import { ApplicationOverviewPage } from './page_objects/application_overview.po';
import { VoOverviewPage } from './page_objects/vo_overview.po';
import { FacilityApplicationOverviewPage } from './page_objects/facility_application_overview.po';
import {ProjectOverViewPage} from './page_objects/project_overview.po';

test.describe.serial('@openstack_cleanup', () => {
	/* not used yet
		test.describe('Should request a project termination for OpenStack', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @openstack_application', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToOpenStackProjectOverview();
			await projectOverviewPage.requestTermination();
		});
	}); */

	test.describe('Aftercare - Should delete old openstack applications', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @openstack_application', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineOpenStackApplications();
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateAllOpenStackPTPRojects();
		});
	});

	test.describe('Aftercare - Should delete old openstack applications', () => {
		test.use({ storageState: FACILITY_MANAGER_STORAGE });
		test('FM @openstack_application', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const facilityApplicationOverviewPage = new FacilityApplicationOverviewPage(page, baseURL);
			await facilityApplicationOverviewPage.terminatePTApplications();
		});
	});

});

test.describe.serial('@simpleVM_cleanup', () => {
	/* not used yet
	test.describe('Should request a termination request for SimpleVM', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Member @simple_vm_application', async ({ page, baseURL }) => {
			const projectOverviewPage = new ProjectOverViewPage(page, baseURL);
			await projectOverviewPage.goToSimpleVMProjectOverview();
			await projectOverviewPage.requestTermination();
		});
	});
	 */

	test.describe('Aftercare - Should delete old simple_vm_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('VO @simple_vm_application', async ({ page, baseURL }) => {
			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page, baseURL);
			await applicationPage.declineSimpleVmApplications();
			const voOverviewPage = new VoOverviewPage(page, baseURL);
			await voOverviewPage.terminateAllSimpleVMPTPprojects();
		});
	});

});
