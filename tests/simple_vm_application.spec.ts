import {
	test,
} from '@playwright/test';
import { FACILITY_MANAGER_STORAGE, MEMBER_STORAGE, VO_MANAGER_STORAGE } from './global-setup';
import { ProfilePage } from './page_objects/profile.po';
import { FormularPage } from './page_objects/formular.po';
import { Util } from './util';
import { ApplicationOverviewPage } from './page_objects/application_overview.po';
import { VoOverviewPage } from './page_objects/vo_overview.po';
import { FacilityApplicationOverviewPage } from './page_objects/facility_application_overview.po';

test.describe.serial('Should delete old simple_vm applications - VO @simple_vm_application @all', () => {

	test.describe('Should delete old simple_vm applications - VO @simple_vm_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });

		test('Should cleanup old  simple_vm applications - VO', async ({ page }) => {

			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page);
			await applicationPage.declineSimpleVmApplications();
			const voOverviewPage = new VoOverviewPage(page);
			await voOverviewPage.terminateAllSimpleVMPTPprojects();

		});

	});

	test.describe('Should request an simple_vm_application - Member @simple_vm_application', () => {
		test.use({ storageState: MEMBER_STORAGE });
		test('Should request a new simple_vm application', async ({ page }) => {
			const formularPage = new FormularPage(page);
			await formularPage.goToNewSimpleVMProject();
			await formularPage.fillApplicationFormular(Util.SIMPLE_VM_APPLICATION_NAME, true, false);
			await formularPage.submitApplication();

		});
	});
	test.describe('Should approve an simple_vm_application - VO @simple_vm_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });
		test('Should approve simple_vm_application', async ({ page }) => {
			const applicationPage = new ApplicationOverviewPage(page);
			await applicationPage.approveSimpleVm(Util.SIMPLE_VM_APPLICATION_NAME);

		});

	});
	test.describe('Aftercare - Should delete old osimple_vm_application - VO @simple_vm_application', () => {
		test.use({ storageState: VO_MANAGER_STORAGE });

		test('Should cleanup simple_vm_application- VO', async ({ page }) => {

			test.setTimeout(60 * 1000);
			const applicationPage = new ApplicationOverviewPage(page);
			await applicationPage.declineSimpleVmApplications();
			const voOverviewPage = new VoOverviewPage(page);
			await voOverviewPage.terminateAllSimpleVMPTPprojects();

		});

	});

});
