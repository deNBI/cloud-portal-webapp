// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-extraneous-dependencies
import { browser, by, element } from 'protractor';
import { Page, expect } from '@playwright/test';
import { Util } from '../util';

/**
 * New Instance Page.
 */
export class ProfilePage {
	private OPEN_GENERATE_KEY_BUTTON: string = 'generateSShKey';
	private GENERATE_KEY_CHECKBOX: string = 'generate_checkbox';
	private GENERATE_KEY_BUTTON: string = 'set_new_ssh_key_button';
	private USER_PUBLIC_KEY_FIELD: string = 'user_public_key';
	private ENTER_PUBLIC_KEY_AREA: string = 'public_key_enter_area';
	private OPEN_SET_KEY_BUTTON: string = 'setPublicKeyButton';
	private PUBLIC_KEY_ACKNOWLEDGE_CHECKBOX = 'public_key_acknowledgement_checkbox';
	private SET_NEW_PUBLIC_KEY_BUTTON: string = 'set_new_public_key_button';
	// eslint-disable-next-line max-len
	private TEST_PUBLIC_KEY: string = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCnkSQ+DSg1Ro6Nk56L6nEzYwTbRzH//8dJOVDFDV1ZKMKDMphOOdYVqcm4JjVmvTqFKAdWldMbdJVa5vGysjiyfad86o+thsSQ7I5aFF5vr3+YaK5NJPssqMi/ElV4pjH0e3Z/r+Y61ZT/9in8jY5z4uWk/sMyW8Q5F2qXcd5IcDUWNMHndDl5jCMgL275HUfAGrimSTukSTPkkVY3UqSo9NppagK31fXLsR2Cajg+NGlmYqZa6ySkp0ydJV9sVDKHMFDty1TLuNMtnT4XMeIwtA+nTvPUU2akx1OsM4HeQq7nQ2r5GKRt/6K9sypEuX/zkmzMhm9IIF7etqBoV8kfNlO7hijjvmbEOxd6C53yOF7xpT4XzZzYF35TC7Gk+GMOIvrnRqrATkDBV9hLRYzQKUUfAGrIo4jH7m2DadppjRVAF679UhSWtksPx3vtTNVV/Dh/WnJmHgniDEAr6IBvMeaUVFvEdCD5506VYpIXj5ckObVJyTaTkQSf1+PxE+E=';
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;

	}

	async goto() {
		console.log('Goto Profile Page');
		await this.page.goto('/userinfo');
		expect(this.page.url()).toContain('/userinfo');

	}

	async generateNewKeyPair(): Promise<any> {
		await this.goto();
		console.log('Opening the Generate Key modal');
		await this.page.locator(`id=${this.OPEN_GENERATE_KEY_BUTTON}`).click();
		console.log('Confirming effects of generating a new Key');
		await this.page.locator(`id=${this.GENERATE_KEY_CHECKBOX}`).click();

		console.log('Clicking on Set-Button');

		await Promise.all([
			this.page.waitForResponse(response => response.status() === 200),
			this.page.locator(`id=${this.GENERATE_KEY_BUTTON}`).click(),

		]);
		await this.page.waitForSelector(`id=${this.USER_PUBLIC_KEY_FIELD} >> text=ecdsa`);

		const new_key = await this.page.innerText(`id=${this.USER_PUBLIC_KEY_FIELD}`);
		expect(new_key).toContain('ecdsa');

		// eslint-disable-next-line no-return-await
	}

	async setNewPublicKey(): Promise<any> {
		await this.goto();

		console.log('Opening the Set Key modal.');
		await this.page.locator(`id=${this.OPEN_SET_KEY_BUTTON}`).click();
		console.log('Copying public key into textfield.');
		await this.page.fill(`id=${this.ENTER_PUBLIC_KEY_AREA}`, this.TEST_PUBLIC_KEY);
		await this.page.locator(`id=${this.PUBLIC_KEY_ACKNOWLEDGE_CHECKBOX}`).click();
		console.log('Clicking on Set-Button');
		await Promise.all([
			this.page.waitForResponse(response => response.status() === 200),
			this.page.locator(`id=${this.SET_NEW_PUBLIC_KEY_BUTTON}`).click(),
		]);
		await this.page.waitForSelector(`id=${this.USER_PUBLIC_KEY_FIELD} >> text=${this.TEST_PUBLIC_KEY}`);
		const new_key = await this.page.innerText(`id=${this.USER_PUBLIC_KEY_FIELD}`);
		expect(new_key).toEqual(this.TEST_PUBLIC_KEY);

	}

}
