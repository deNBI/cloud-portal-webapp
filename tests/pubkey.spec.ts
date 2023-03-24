import { test } from '@playwright/test';
import { ProfilePage } from './page_objects/profile.po';
import { Util } from './util';

test.describe('@pub_key', () => {
	test.use({ storageState: Util.MEMBER_STORAGE });
	test('Member @pub_key should set and generate pub keys', async ({ page, baseURL }) => {
		const profile = new ProfilePage(page, baseURL);
		await profile.generateNewKeyPair();
		await profile.setNewPublicKey();
	});
});
