import {
	test,
} from '@playwright/test';
import { MEMBER_STORAGE, VO_MANAGER_STORAGE } from './global-setup';
import { ProfilePage } from './page_objects/profile.po';
import { FormularPage } from './page_objects/formular.po';
import { Util } from '../e2e/util';
import { ApplicationOverviewPage } from './page_objects/application_overview.po';

test.describe('Should request a simplevm application', () => {
	/* test.use({ storageState: MEMBER_STORAGE });
	test('Should go to new simple vm formular', async ({ page, baseURL }) => {
		const formularPage = new FormularPage(page, baseURL);
		await formularPage.goToNewSimpleVMProject();
		await formularPage.fillApplicationFormular(Util.SIMPLE_VM_APPLICATION_NAME, true, false);
		await formularPage.submitApplication();

	}); */
	test.use({ storageState: VO_MANAGER_STORAGE });
	test('Should approve simplevm application', async ({ page, baseURL }) => {
		const applicationPage = new ApplicationOverviewPage(page, baseURL);
		await applicationPage.approveSimpleVm(Util.SIMPLE_VM_APPLICATION_NAME);

	});

});
