// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-extraneous-dependencies
import { browser, by, element } from 'protractor';
import { Util } from '../util';

/**
 * New Instance Page.
 */
export class ProfilePage {
	private static OPEN_GENERATE_KEY_BUTTON: string = 'generateSShKey';
	private static GENERATE_KEY_CHECKBOX: string = 'generate_checkbox';
	private static GENERATE_KEY_BUTTON: string = 'set_new_ssh_key_button';
	private static USER_PUBLIC_KEY_FIELD: string = 'user_public_key';
	private static ENTER_PUBLIC_KEY_AREA: string = 'public_key_enter_area';
	private static OPEN_SET_KEY_BUTTON: string = 'setPublicKeyButton';
	private static SET_NEW_PUBLIC_KEY_BUTTON: string = 'set_new_public_key_button';
	// eslint-disable-next-line max-len
	private static TEST_PUBLIC_KEY: string = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCnkSQ+DSg1Ro6Nk56L6nEzYwTbRzH//8dJOVDFDV1ZKMKDMphOOdYVqcm4JjVmvTqFKAdWldMbdJVa5vGysjiyfad86o+thsSQ7I5aFF5vr3+YaK5NJPssqMi/ElV4pjH0e3Z/r+Y61ZT/9in8jY5z4uWk/sMyW8Q5F2qXcd5IcDUWNMHndDl5jCMgL275HUfAGrimSTukSTPkkVY3UqSo9NppagK31fXLsR2Cajg+NGlmYqZa6ySkp0ydJV9sVDKHMFDty1TLuNMtnT4XMeIwtA+nTvPUU2akx1OsM4HeQq7nQ2r5GKRt/6K9sypEuX/zkmzMhm9IIF7etqBoV8kfNlO7hijjvmbEOxd6C53yOF7xpT4XzZzYF35TC7Gk+GMOIvrnRqrATkDBV9hLRYzQKUUfAGrIo4jH7m2DadppjRVAF679UhSWtksPx3vtTNVV/Dh/WnJmHgniDEAr6IBvMeaUVFvEdCD5506VYpIXj5ckObVJyTaTkQSf1+PxE+E=';

	static async generateNewKeyPair(): Promise<any> {
		Util.logInfo('Opening the Generate Key modal');
		await Util.waitForPresenceOfElementById(this.OPEN_GENERATE_KEY_BUTTON);
		await Util.clickElementById(this.OPEN_GENERATE_KEY_BUTTON);
		Util.logInfo('Confirming effects of generating a new Key');
		await Util.waitForPresenceOfElementById(this.GENERATE_KEY_CHECKBOX);
		await Util.clickElementById(this.GENERATE_KEY_CHECKBOX);
		Util.logInfo('Clicking on Set-Button');
		await Util.waitForPresenceOfElementById(this.GENERATE_KEY_BUTTON);
		await Util.clickElementById(this.GENERATE_KEY_BUTTON);
		await browser.sleep(5000);
		await Util.waitForPresenceOfElementById(this.USER_PUBLIC_KEY_FIELD);
		await browser.sleep(5000);

		// eslint-disable-next-line no-return-await
		return await Util.getElemTextById(this.USER_PUBLIC_KEY_FIELD);
	}

	static async setNewPublicKey(): Promise<any> {
		Util.logInfo('Opening the Set Key modal.');
		await Util.waitForPresenceOfElementById(this.OPEN_SET_KEY_BUTTON);
		await Util.clickElementById(this.OPEN_SET_KEY_BUTTON);
		Util.logInfo('Copying public key into textfield.');
		await Util.waitForPresenceOfElementById(this.ENTER_PUBLIC_KEY_AREA);
		await Util.sendTextToElementByIdUnsecure(this.ENTER_PUBLIC_KEY_AREA, this.TEST_PUBLIC_KEY);
		Util.logInfo('Clicking on Set-Button');
		await Util.waitForPresenceOfElementById(this.SET_NEW_PUBLIC_KEY_BUTTON);
		await Util.clickElementById(this.SET_NEW_PUBLIC_KEY_BUTTON);
		await browser.sleep(5000);

		// eslint-disable-next-line no-return-await
		return await Util.getElemTextById(this.USER_PUBLIC_KEY_FIELD);
	}

	static async getPublicKeySet(): Promise<any> {
		// eslint-disable-next-line no-return-await
		return await Util.getElemTextById(this.USER_PUBLIC_KEY_FIELD);
	}
}
