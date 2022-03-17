import { test } from '@playwright/test';
import { FACILITY_MANAGER_STORAGE, MEMBER_STORAGE, VO_MANAGER_STORAGE } from './global-setup';
import { ProfilePage } from './page_objects/profile.po';

test.describe('@login', () => {
	test.use({ storageState: VO_MANAGER_STORAGE });
	test('vo @login', async ({ page, baseURL }) => {
		const profile = new ProfilePage(page, baseURL);
		await profile.goto();
	});
});

test.describe('@login', () => {
	test.use({ storageState: FACILITY_MANAGER_STORAGE });
	test('fm @login', async ({ page, baseURL }) => {
		const profile = new ProfilePage(page, baseURL);
		await profile.goto();
	});
});

test.describe('@login', () => {
	test.use({ storageState: MEMBER_STORAGE });
	test('member @login', async ({ page, baseURL }) => {
		const profile = new ProfilePage(page, baseURL);
		await profile.goto();
	});
});
