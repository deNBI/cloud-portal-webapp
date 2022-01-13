import {
	browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions,
} from 'protractor';
// tslint:disable-next-line:no-require-imports no-var-requires typedef
// const clc = require('cli-color');
// tslint:disable-next-line:no-require-imports no-var-requires typedef
const log4jsGen = require('./log4jsGen');

/**
 * Util test class.
 */
export class Util {
	private static angular_url: string = browser.params.angular;

	private static auth: string = browser.params.login.auth;
	private static _SIMPLE_VM_APPLICATION_NAME_NO_PI: string = 'PTSimpleVMNoPi';
	private static _OPENSTACK_APPLICATION_NAME: string = 'PTOpenStack';
	private static _SIMPLE_VM_APPLICATION_NAME: string = 'PTSimpleVM';
	private static _PI_EMAIL: string = 'test@test.com';
	private static _BASIC_VM_NAME: string = 'PTSIMPLEVM';
	private static _VOLUME_VM_NAME: string = 'ProtractorVMVolume';
	private static _VOLUME_NAME: string = 'ProtractorVolume';
	private static _VOLUME_SPACE: string = '1';
	private static _WORKSHOP_NAME: string = 'PTWS';
	private static _ONE_MINUTE_TIMEOUT: number = 60000;
	private static _timeout: number = Util._ONE_MINUTE_TIMEOUT * 2;
	private static _15_MIN_TIMEOUT: number = Util._ONE_MINUTE_TIMEOUT * 15;
	private static _30_MIN_TIMEOUT: number = Util._ONE_MINUTE_TIMEOUT * 30;
	private static _DEFAULT_FLAVOR_TITLE: string = 'de.NBI default';
	private static _UBUNTU_18_TITLE: string = 'Ubuntu 18.04 LTS (2021-12-13)';
	private static _CWLAB: string = 'cwlab';

	private static _VOLUME_MOUNT_PATH_STRING: string = 'path';

	private static _BASIC_SNAPSHOT_NAME: string = 'PTSnap';
	private static _ALTERNATIVE_SNAPSHOT_NAME: string = 'PTSnapTwo';

	// tslint:disable-next-line:no-require-imports
	static get PI_EMAIL(): string {
		return this._PI_EMAIL;
	}

	static get CWLAB(): string {
		return this._CWLAB;
	}

	static get USER_ACCOUNT_ELIXIR_ID(): string {
		return browser.params.login.elixir_id_user;
	}

	static get VO_ACCOUNT_ELIXIR_ID(): string {
		return browser.params.login.elixir_id_vo;
	}

	static get DEFAULT_FLAVOR_NAME(): string {
		return this._DEFAULT_FLAVOR_TITLE;
	}

	static get UBUNTU_18_TITLE(): string {
		return this._UBUNTU_18_TITLE;
	}

	static get VOLUME_MOUNT_PATH_STRING(): string {
		return this._VOLUME_MOUNT_PATH_STRING;
	}

	static get ALTERNATIVE_SNAPSHOT_NAME(): string {
		return this._ALTERNATIVE_SNAPSHOT_NAME;
	}

	static get SIMPLE_VM_APPLICATION_NAME_NO_PI(): string {
		return this._SIMPLE_VM_APPLICATION_NAME_NO_PI;
	}

	static get SIMPLE_VM_APPLICATION_NAME(): string {
		return this._SIMPLE_VM_APPLICATION_NAME;
	}

	static get MIN_TIMEOUT_1(): number {
		return this._ONE_MINUTE_TIMEOUT;
	}

	static get MIN_TIMEOUT_15(): number {
		return this._15_MIN_TIMEOUT;
	}

	static get MIN_TIMOEUT_30(): number {
		return this._30_MIN_TIMEOUT;
	}

	static get BASIC_SNAPSHOT_NAME(): string {
		return this._BASIC_SNAPSHOT_NAME;
	}

	static get OPENSTACK_APPLICATION_NAME(): string {
		return this._OPENSTACK_APPLICATION_NAME;
	}

	static get VOLUME_VM_NAME(): string {
		return this._VOLUME_VM_NAME;
	}

	static get BASIC_VM_NAME(): string {
		return this._BASIC_VM_NAME;
	}

	static get VOLUME_NAME(): string {
		return this._VOLUME_NAME;
	}

	static get timeout(): number {
		return this._timeout;
	}

	static get VOLUME_SPACE(): string {
		return this._VOLUME_SPACE;
	}

	static get WORKSHOP_NAME(): string {
		return this._WORKSHOP_NAME;
	}

	static logInfo(text: string): void {
		log4jsGen.getLogger().info(text);

	}

	static logWarn(text: string): void {
		log4jsGen.getLogger().warn(text);

	}

	static logDebug(text: string): void {
		log4jsGen.getLogger().info(text);

	}

	static logError(text: string): void {
		log4jsGen.getLogger().error(text);

	}

	static async scrollToElement(scrollTo: ElementFinder): Promise<void> {
		const location = await scrollTo.getLocation();
		this.logInfo(`Scroll to Element [X-${location.x} : Y-${location.y}] `);
		await browser.sleep(500);
		await browser.executeScript('arguments[0].scrollIntoView()', scrollTo.getWebElement());

	}

	static async clickElementByLinkTextIgnoreError(text: string, timeout: number = this.timeout): Promise<boolean> {
		await Util.waitForElementToBeClickableByLinkText(text);
		this.logInfo(`Clicking element with text: [${text}]`);

		try {
			await this.scrollToElement(element(by.linkText(text)));
			await element(by.linkText(text)).click();
		} catch (error) {
			this.logInfo(`Coudln't click ${text} - Ignore Error`);

			return false;
		}

		return true;
	}

	static async waitForPageIgnoreError(url: string, timeout: number = this.timeout): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
		await browser.sleep(2000);

		this.logInfo(`Waiting until page contains ${url}`);
		try {
			await browser.driver.wait(until_.urlContains(url), timeout);
		} catch (error) {
			this.logInfo(`Didn't load ${url} - Ignore Error`);

			return false;
		}

		return true;
	}

	static async waitForPage(url: string, timeout: number = this.timeout): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
		this.logInfo(`Waiting until page contains ${url}`);
		await browser.sleep(2000);

		return await browser.driver.wait(until_.urlContains(url), timeout);
	}

	static async sendTextToElementByName(name: string, text: string, show_output: boolean = true): Promise<void> {
		if (show_output) {
			this.logInfo(`Send text [${text}] to element ${name}`);

		}
		const elem: ElementFinder = element(by.name(name));

		return await elem.sendKeys(text);
	}

	static async sendTextToElementByNameWithoutLogging(name: string, text: string): Promise<void> {
		this.logInfo(`Sending text [redacted] to element ${name}`);
		const elem: ElementFinder = element(by.name(name));

		return await elem.sendKeys(text);
	}

	static async sendTextToElementByElement(elem: any, text: string, show_output: boolean = true): Promise<void> {
		if (show_output) {
			this.logInfo(`Send text [${text}] to element  [${elem}]`);

		}

		return await elem.sendKeys(text);
	}

	static async clickElementByLinkText(text: string): Promise<void> {
		await Util.waitForElementToBeClickableByLinkText(text);
		await this.scrollToElement(element(by.linkText(text)));

		this.logInfo(`Clicking element with text: [${text}]`);

		return await element(by.linkText(text)).click();

	}

	static async waitForElementToBeClickableByLinkText(text: string, timeout: number = this.timeout): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
		this.logInfo(`Waiting until element is clickable with text:  ${text}`);

		const elem: ElementFinder = element(by.linkText(text));

		return await browser.driver.wait(until_.elementToBeClickable(elem), timeout, `Element [${text}] taking too long to be clickable`);
	}

	static async sendTextToElementByIdSecure(id: string, text: string): Promise<void> {
		await this.waitForVisibilityOfElementById(id);
		const elem: ElementFinder = element(by.id(id));
		await elem.clear();
		await elem.sendKeys(text);
		const str: string = await elem.getAttribute('value');

		if (str !== text) {
			this.logWarn('Text  is not send by xpath in field so i will try to send string char by char!');

			await elem.clear();
			for (let idx: number = 0; idx < text.length; idx++) {
				// tslint:disable-next-line:prefer-template
				await elem.sendKeys(`${text.charAt(idx)}`);
			}
		}

	}

	static async sendTextToElementByIdUnsecure(id: string, text: string): Promise<void> {
		await this.waitForVisibilityOfElementById(id);
		this.logInfo(`Send text [${text}] to element ${id}`);

		const elem: ElementFinder = element(by.id(id));
		await elem.clear();
		await elem.sendKeys(text);
		const str: string = await elem.getAttribute('value');

		if (str !== text) {
			this.logWarn('Text  is not send by xpath in field so i will try to send string char by char!');

			await elem.clear();
			for (let idx: number = 0; idx < text.length; idx++) {
				// tslint:disable-next-line:prefer-template
				await elem.sendKeys(`${text.charAt(idx)}`);
			}
		}

	}

	static async clickElementByName(name: string): Promise<void> {
		await this.waitForElementToBeClickableByName(name);
		this.logInfo(`Clicking element ${name}`);
		await this.scrollToElement(element(by.name(name)));

		return await element(by.name(name)).click();
	}

	static async checkInputsByIdsGotSameValue(id_1: string, id_2: string, timeout: number = this.timeout): Promise<any> {
		const val1: any = await this.getInputValueById(id_1);
		const val2: any = await this.getInputValueById(id_2);
		this.logInfo(`Val1 [${val1}] | Val2 [${val2}]`);
		expect(val1).toEqual(val2);
	}

	static async getInputValueById(id: string, timeout: number = this.timeout): Promise<string> {
		this.logInfo(`Get input value from ${id}`);

		await this.waitForVisibilityOfElementById(id, timeout);

		return await element(by.id(id)).getAttribute('value');
	}

	static async getElemTextById(id: string, timeout: number = this.timeout): Promise<string> {
		this.logInfo(`Get elem text from ${id}`);

		await this.waitForVisibilityOfElementById(id, timeout);

		return await element(by.id(id)).getText();
	}

	static async clickElementByElement(
		elem: any,
																		 timeout: number = this.timeout,
																		 id: string = 'Elementfinder',
	): Promise<void> {
		await this.waitForElementToBeClickableByElement(elem, timeout, id);
		await this.scrollToElement(elem);

		this.logInfo(`Clicking element ${id}`);

		return await elem.click();
	}

	static async clickElementById(id: string, timeout: number = this.timeout): Promise<void> {
		await this.waitForVisibilityOfElementById(id, timeout);
		await this.waitForElementToBeClickableById(id, timeout);
		await this.scrollToElement(element(by.id(id)));

		this.logInfo(`Clicking element ${id}`);

		return await element(by.id(id)).click();
	}

	static async waitForTextPresenceInElementById(id: string, text: string, timeout: number = this.timeout): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
		this.logInfo(`Waiting until text [${text}] appears in  element ${id}`);

		const elem: ElementFinder = element(by.id(id));

		return await browser.driver.wait(until_.textToBePresentInElement(elem, text), timeout, `Text [${id}] taking too long to appear in the Element`);
	}

	static async waitForPresenceOfElementById(id: string, timeout: number = this.timeout): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
		this.logInfo(`Waiting until page contains element ${id}`);

		const elem: ElementFinder = element(by.id(id));

		return await browser.driver.wait(until_.presenceOf(elem), timeout, `Element  [${id}] taking too long to appear in the DOM`);
	}

	static async waitForPresenceOfLinkByPartialId(prefix: string, id: string, timeout: number = this.timeout): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
		this.logInfo(`Waiting until page contains element ${id}`);

		const elem: ElementFinder = element(by.css(`a[id^=${prefix}${id}]`));

		return await browser.driver.wait(until_.presenceOf(elem), timeout, `Element [${prefix}${id}] taking too long to appear in the DOM`);
	}

	static async waitForPresenceOfElementsByPrefix(prefix: string, timeout: number = this.timeout): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
		this.logInfo(`Waiting until page contains elements with prefix ${prefix}`);

		await element.all(by.css(`[id^=${prefix}]`)).then(
			async (elem) => {
				// eslint-disable-next-line @typescript-eslint/prefer-for-of
				for (let i: number = 0; i < elem.length; i += 1) {
					// eslint-disable-next-line no-await-in-loop
					await browser.driver.wait(until_.presenceOf(elem[i]), timeout, `Element [${prefix}] taking too long to appear in the DOM`);
				}
			},
		);

		return true;
	}

	static async waitForPresenceByElement(elem: any, timeout: number = this.timeout, id: string = 'Elementfinder'): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
		this.logInfo(`Waiting until page contains element ${id}`);

		return await browser.driver.wait(until_.presenceOf(elem), timeout, `Element [${id}] taking too long to appear in the DOM`);
	}

	static async waitForAbsenceOfElementById(id: string, timeout: number = this.timeout): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
		this.logInfo(`Waiting until page does not contain element ${id}`);

		const elem: ElementFinder = element(by.id(id));

		return await browser.driver.wait(until_.not(until_.presenceOf(elem)), timeout, `Element [${id}] taking too long to appear in the DOM`);
	}

	static async waitForVisibilityOfElementById(id: string, timeout: number = this.timeout): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;

		this.logInfo(`Waiting until element ${id} is visibile`);

		const elem: ElementFinder = element(by.id(id));

		return await browser.driver.wait(until_.visibilityOf(elem), timeout, `Element [${id}] taking too long to be visibile`);
	}

	static async waitForInvisibilityOfElementByElement(
		elem: any,
																										 timeout: number = this.timeout,
																										 id: string = 'Elementfinder',
	): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
		this.logInfo(`Waiting until element ${id} is invisibile`);

		return await browser.driver.wait(until_.invisibilityOf(elem), timeout, `Element [${id}] taking too long to be invisibile`);
	}

	static async waitForInvisibilityOfElementById(id: string, timeout: number = this.timeout): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
		this.logInfo(`Waiting until element ${id} is invisibile`);

		const elem: any = element(by.id(id));

		return await browser.driver.wait(until_.invisibilityOf(elem), timeout, `Element [${id}] taking too long to be invisibile`);
	}

	static async waitForElementToBeClickableById(id: string, timeout: number = this.timeout): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;

		this.logInfo(`Waiting until element is clickable ${id}`);

		const elem: ElementFinder = element(by.id(id));

		return await browser.driver.wait(until_.elementToBeClickable(elem), timeout, `Element [${id}] taking too long to be clickable`);
	}

	static async waitForElementToBeClickableByElement(
		elem: any,
		timeout: number = this.timeout,
		id: string = 'Elementfinder',
	): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
		this.logInfo(`Waiting until element is clickable ${id}`);

		return await browser.driver.wait(until_.elementToBeClickable(elem), timeout, `Element [${id}] taking too long to be clickable`);
	}

	static async navigateToAngularPage(url_suffix: string): Promise<any> {
		this.logInfo(`Navigating to ${this.angular_url}#/${url_suffix}`);

		return await browser.get(`${this.angular_url}#/${url_suffix}`);
	}

	static async waitForTextInUrl(text: string): Promise<any> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;

		return browser.wait(until_.urlContains(text), this.timeout);
	}

	static async clickOptionOfSelect(option: string, selectId: string): Promise<any> {
		this.logInfo(`Getting option ${option} from select ${selectId}`);

		await this.waitForPresenceOfElementById(selectId);
		await this.scrollToElement(element(by.id(selectId)).element(by.id(option)));

		const elem: any = element(by.id(selectId)).element(by.id(option));

		return await elem.click();
	}

	static async waitForElementToBeClickableByName(name: string, timeout: number = this.timeout): Promise<boolean> {
		const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
		this.logInfo(`Waiting until element is clickable ${name}`);

		const elem: ElementFinder = element(by.name(name));

		return await browser.driver.wait(until_.elementToBeClickable(elem), timeout, `Element  [${name}]taking too long to be clickable`);
	}

	static async getTextFromLinkElement(prefix: string, name: string): Promise<string> {

		await this.waitForPresenceOfLinkByPartialId(prefix, name);
		const elem: ElementFinder = element(by.css(`a[id^=${prefix}${name}]`));

		return elem.getText();
	}

	static async getTextFromElementsByIdPrefix(prefix: string): Promise<string[]> {
		await this.waitForPresenceOfElementsByPrefix(prefix);
		// const elements: ElementArrayFinder = element.all(by.css(`[id^=${prefix}]`));

		const elementsText: string[] = [];
		await element.all(by.css(`[id^=${prefix}]`)).then(
			async (elem) => {
				// eslint-disable-next-line @typescript-eslint/prefer-for-of
				for (let i: number = 0; i < elem.length; i += 1) {
					// eslint-disable-next-line no-await-in-loop
					elem[i].getText().then(
						(text) => {
							elementsText.push(text);
						},
					);
				}
			},
		);

		return elementsText;
	}

	static async getElementsByIdPrefix(prefix: string): Promise<any> {
		return await element.all(by.css(`[id^=${prefix}]`));
	}

	static async isElementPresentById(id: string): Promise<boolean> {
		return await element(by.id(id)).isPresent();
	}
}
