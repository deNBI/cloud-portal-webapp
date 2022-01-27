import {
	test,
} from '@playwright/test';
import { FACILITY_MANAGER_STORAGE, MEMBER_STORAGE, VO_MANAGER_STORAGE } from './global-setup';
import { ProfilePage } from './page_objects/profile.po';

test.describe('Vo login', () => {
	test.use({ storageState: VO_MANAGER_STORAGE });
	test('vo should be logged in', async ({ page, baseURL }) => {
		const profile = new ProfilePage(page, baseURL);
		await profile.goto();

	});

});

test.describe('Facility Manager Login', () => {
	test.use({ storageState: FACILITY_MANAGER_STORAGE });
	test('facility manager should be logged in', async ({ page, baseURL }) => {

		const profile = new ProfilePage(page, baseURL);
		await profile.goto();

	});

});

test.describe('Member Login', () => {
	test.use({ storageState: MEMBER_STORAGE });
	test('member should be logged in', async ({ page, baseURL }) => {
		const profile = new ProfilePage(page, baseURL);
		await profile.goto();

	});

});
