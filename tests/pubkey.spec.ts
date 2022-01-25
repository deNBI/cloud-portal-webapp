import {
	test,
} from '@playwright/test';
import { MEMBER_STORAGE } from './global-setup';
import { ProfilePage } from './page_objects/profile.po';

test.describe('Member Set PubKeys', () => {
	test.use({ storageState: MEMBER_STORAGE });
	test('Member should set and gernerate pub keys', async ({ page }) => {
		const profile = new ProfilePage(page);
		await profile.generateNewKeyPair();
		await profile.setNewPublicKey();

	});

});
