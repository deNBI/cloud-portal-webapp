import { test } from '@playwright/test';
import { ProfilePage } from './page_objects/profile.po';
import {Util} from './util';

test.describe('@login', () => {
	test.use({ storageState: Util.VO_MANAGER_STORAGE });
	test('vo @login', async ({ page, baseURL }) => {
		const profile = new ProfilePage(page, baseURL);
		await profile.goto();
	});
});

test.describe('@login', () => {
	test.use({ storageState: Util.FACILITY_MANAGER_STORAGE });
	test('fm @login', async ({ page, baseURL }) => {
		const profile = new ProfilePage(page, baseURL);
		await profile.goto();
	});
});

test.describe('@login', () => {
	test.use({ storageState: Util.MEMBER_STORAGE });
	test('member @login', async ({ page, baseURL }) => {
		const profile = new ProfilePage(page, baseURL);
		await profile.goto();
	});
});
