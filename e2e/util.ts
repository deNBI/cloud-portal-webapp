import {browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions} from 'protractor';
// tslint:disable-next-line:no-require-imports no-var-requires typedef
// const clc = require('cli-color');
// tslint:disable-next-line:no-require-imports no-var-requires typedef
const log4jsGen = require('./log4jsGen');

/**
 * Util test class.
 */
export class Util {
  private static angular_url: string = browser.params.angular;

  private static _timeout: number = browser.params.timeout;
  private static auth: string = browser.params.login.auth;
  private static _SIMPLE_VM_APPLICATION_NAME_NO_PI: string = 'PTSimpleVMNoPi';
  private static _OPENSTACK_APPLICATION_NAME: string = 'PTOpenStack';
  private static _SIMPLE_VM_APPLICATION_NAME: string = 'PTSimpleVM';
  private static _PI_EMAIL: string = 'test@test.com';
  private static _BASIC_VM_NAME: string = 'PTSIMPLEVM';
  private static _VOLUME_VM_NAME: string = 'ProtractorVMVolume';
  private static _VOLUME_NAME: string = 'ProtractorVolume';
  private static _VOLUME_SPACE: string = '1';
  private static _LONG_TIMEOUT: number = 420000;
  private static _VOLUME_MOUNT_PATH_STRING: string = 'path';

  private static _BASIC_SNAPSHOT_NAME: string = 'PTSnap';
  private static _ALTERNATIVE_SNAPSHOT_NAME: string = 'PTSnapTwo';

  // tslint:disable-next-line:no-require-imports
  static get PI_EMAIL(): string {
    return this._PI_EMAIL;
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

  static get LONG_TIMEOUT(): number {
    return this._LONG_TIMEOUT;
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
    return this._VOLUME_NAME
  }

  static get timeout(): number {
    return this._timeout;
  }

  static get VOLUME_SPACE(): string {
    return this._VOLUME_SPACE;
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

  static async waitForPageIgnoreError(url: string, timeout: number = this.timeout): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
    await browser.sleep(2000);

    this.logInfo(`Waiting until page contains ${url}`)
    try {
      await browser.driver.wait(until_.urlContains(url), timeout);
    } catch (error) {
      this.logInfo(`Didn't load ${url} - Ignore Error`)

      return false
    }

    return true
  }

  static async waitForPage(url: string, timeout: number = this.timeout): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
    this.logInfo(`Waiting until page contains ${url}`)
    await browser.sleep(2000);

    return await browser.driver.wait(until_.urlContains(url), timeout);
  }

  static async sendTextToElementByName(name: string, text: string, show_output: boolean = true): Promise<void> {
    if (show_output) {
      this.logInfo(`Send text [${text}] to element ${name}`)

    }
    const elem: ElementFinder = element(by.name(name));

    return await elem.sendKeys(text);
  }

  static async sendTextToElementByElement(elem: any, text: string, show_output: boolean = true): Promise<void> {
    if (show_output) {
      this.logInfo(`Send text [${text}] to element  [${elem}]`)

    }

    return await elem.sendKeys(text);
  }

  static async clickElementByLinkText(text: string): Promise<void> {
    await Util.waitForElementToBeClickableByLinkText(text)
    this.logInfo(`Clicking element with text: [${text}]`)

    return await element(by.linkText(text)).click();

  }

  static async waitForElementToBeClickableByLinkText(text: string, timeout: number = this.timeout): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
    this.logInfo(`Waiting until element is clickable with text:  ${text}`)

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
      this.logWarn('Text  is not send by xpath in field so i will try to send string char by char!')

      await elem.clear();
      for (let idx: number = 0; idx < text.length; idx++) {
        // tslint:disable-next-line:prefer-template
        await elem.sendKeys(`${text.charAt(idx)}`);
      }
    }

    return;

  }

  static async sendTextToElementByIdUnsecure(id: string, text: string): Promise<void> {
    await this.waitForVisibilityOfElementById(id);
    this.logInfo(`Send text [${text}] to element ${id}`)

    const elem: ElementFinder = element(by.id(id));
    await elem.clear();
    await elem.sendKeys(text);
    const str: string = await elem.getAttribute('value');

    if (str !== text) {
      this.logWarn('Text  is not send by xpath in field so i will try to send string char by char!')

      await elem.clear();
      for (let idx: number = 0; idx < text.length; idx++) {
        // tslint:disable-next-line:prefer-template
        await elem.sendKeys(`${text.charAt(idx)}`);
      }
    }

    return;

  }

  static async clickElementByName(name: string): Promise<void> {
    await this.waitForElementToBeClickableByName(name);
    this.logInfo(`Clicking element ${name}`);
    const elem: ElementFinder = element(by.name(name));

    return await elem.click();
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

  static async clickElementByElement(elem: any,
                                     timeout: number = this.timeout,
                                     id: string = 'Elementfinder'): Promise<void> {
    await this.waitForElementToBeClickableByElement(elem, timeout, id);
    this.logInfo(`Clicking element ${id}`);

    return await elem.click();
  }

  static async clickElementById(id: string, timeout: number = this.timeout): Promise<void> {
    await this.waitForVisibilityOfElementById(id, timeout);
    await this.waitForElementToBeClickableById(id, timeout);
    this.logInfo(`Clicking element ${id}`);
    const elem: ElementFinder = element(by.id(id));

    return await elem.click();
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

  static async waitForInvisibilityOfElementByElement(elem: any,
                                                     timeout: number = this.timeout,
                                                     id: string = 'Elementfinder'): Promise<boolean> {
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
    id: string = 'Elementfinder'): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
    this.logInfo(`Waiting until element is clickable ${id}`);

    return await browser.driver.wait(until_.elementToBeClickable(elem), timeout, `Element [${id}] taking too long to be clickable`);
  }

  static async navigateToAngularPage(url_suffix: string): Promise<any> {
    this.logInfo(`Navigating to ${this.angular_url}/#/${url_suffix}`);

    return await browser.get(`${this.angular_url}/#/${url_suffix}`);
  }

  static async waitForTextInUrl(text: string): Promise<any> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;

    return browser.wait(until_.urlContains(text), this.timeout)
  }

  static async clickOptionOfSelect(option: string, selectId: string): Promise<any> {
    this.logInfo(`Getting option ${option} from select ${selectId}`);

    await this.waitForPresenceOfElementById(selectId);
    const elem: any = element(by.id(selectId)).element(by.id(option))

    return await elem.click();
  }

  static async waitForElementToBeClickableByName(name: string, timeout: number = this.timeout): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
    this.logInfo(`Waiting until element is clickable ${name}`);

    const elem: ElementFinder = element(by.name(name));

    return await browser.driver.wait(until_.elementToBeClickable(elem), timeout, `Element  [${name}]taking too long to be clickable`);
  }

  static async getTextFromLinkElement(prefix: string, name: string): Promise<string> {
    await this.waitForPresenceOfLinkByPartialId(prefix, name, Util.LONG_TIMEOUT);
    const elem: ElementFinder = element(by.css(`a[id^=${prefix}${name}]`));

    return elem.getText();
  }
}
