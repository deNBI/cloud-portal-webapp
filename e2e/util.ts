import {browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions, until} from 'protractor';
// tslint:disable-next-line:no-require-imports id-length
import _ = require('colors');
import {By} from '@angular/platform-browser';

/**
 * Util test class.
 */
export class Util {
  private static angular_url: string = browser.params.angular;

  private static _timeout: number = browser.params.timeout;
  private static auth: string = browser.params.login.auth;
  private static _SIMPLE_VM_APPLICATION_NAME: string = 'PTSimpleVM';
  private static _OPENSTACK_APPLICATION_NAME: string = 'PTOpenStack';
  private static _BASIC_VM_NAME: string = 'PTSIMPLEVM';
  private static _VOLUME_VM_NAME: string = 'ProtractorVMVolume';
  private static _VOLUME_NAME: string = 'ProtractorVolume';
  private static _VOLUME_SPACE: string = '1';
  private static _LONG_TIMEOUT: number = 420000;
  private static _BASIC_SNAPSHOT_NAME: string = 'PTSnap';

  // tslint:disable-next-line:no-require-imports

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
    console.log(text.blue);
  }

  static logHeader(text: string): void {
    console.log(text.magenta)
  }

  static logMethodCall(text: string): void {
    console.log(text.cyan)
  }

  static async waitForPage(url: string): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until page contains ${url}`);
    await browser.sleep(2000);

    return await browser.driver.wait(until_.urlContains(url), this._timeout);
  }

  static async sendTextToElementByName(name: string, text: string, show_output: boolean = true): Promise<void> {
    if (show_output) {
      console.log(`Send text [${text}] to element ${name}`);
    }
    const elem: ElementFinder = element(by.name(name));

    return await elem.sendKeys(text);
  }

  static async sendTextToElementByElement(elem: any, text: string, show_output: boolean = true): Promise<void> {
    if (show_output) {
      this.logInfo(`Send text [${text}] to element  [${elem}]`);
    }

    return await elem.sendKeys(text);
  }

  static async sendTextToElementById(id: string, text: string, show_output: boolean = true): Promise<void> {
    await this.waitForVisibilityOfElementById(id);
    if (show_output) {
      console.log(`Send text [${text}] to element ${id}`);
    }
    const elem: ElementFinder = element(by.id(id));
    await elem.clear();

    return await elem.sendKeys(text);
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
    console.log(`Get input value from ${id}`);
    await this.waitForVisibilityOfElementById(id, timeout);

    return await element(by.id(id)).getAttribute('value');
  }

  static async getElemTextById(id: string, timeout: number = this.timeout): Promise<string> {
    console.log(`Get elem text from ${id}`);

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

    console.log(`Waiting until text [${text}] appears in  element ${id}`);
    const elem: ElementFinder = element(by.id(id));

    return await browser.driver.wait(until_.textToBePresentInElement(elem, text), timeout, 'Text taking too long to appear in the Element');
  }

  static async waitForPresenceOfElementById(id: string, timeout: number = this.timeout): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until page contains element ${id}`);
    const elem: ElementFinder = element(by.id(id));

    return await browser.driver.wait(until_.presenceOf(elem), timeout, 'Element taking too long to appear in the DOM');
  }

  static async waitForPresenceByElement(elem: any, timeout: number = this.timeout, id: string = 'Elementfinder'): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until page contains element ${id}`);

    return await browser.driver.wait(until_.presenceOf(elem), timeout, 'Element taking too long to appear in the DOM');
  }

  static async waitForAbsenceOfElementById(id: string, timeout: number = this.timeout): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until page does not contain element ${id}`);
    const elem: ElementFinder = element(by.id(id));

    return await browser.driver.wait(until_.not(until_.presenceOf(elem)), timeout, 'Element taking too long to appear in the DOM');
  }

  static async waitForVisibilityOfElementById(id: string, timeout: number = this.timeout): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;

    console.log(`Waiting until element ${id} is visibile`);
    const elem: ElementFinder = element(by.id(id));

    return await browser.driver.wait(until_.visibilityOf(elem), timeout, 'Element taking too long to be visibile');
  }

  static async waitForInvisibilityOfElementByElement(elem: any,
                                                     timeout: number = this.timeout,
                                                     id: string = 'Elementfinder'): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until element ${id} is invisibile`);

    return await browser.driver.wait(until_.invisibilityOf(elem), timeout, 'Element taking too long to be invisibile');
  }

  static async waitForInvisibilityOfElementById(id: string, timeout: number = this.timeout): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until element ${id} is invisibile`);
    const elem: any = element(by.id(id));

    return await browser.driver.wait(until_.invisibilityOf(elem), timeout, 'Element taking too long to be invisibile');
  }

  static async waitForElementToBeClickableById(id: string, timeout: number = this.timeout): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;

    console.log(`Waiting until element is clickable ${id}`);
    const elem: ElementFinder = element(by.id(id));

    return await browser.driver.wait(until_.elementToBeClickable(elem), timeout, 'Element taking too long to be clickable');
  }

  static async waitForElementToBeClickableByElement(
    elem: any,
    timeout: number = this.timeout,
    id: string = 'Elementfinder'): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until element is clickable ${id}`);

    return await browser.driver.wait(until_.elementToBeClickable(elem), timeout, 'Element taking too long to be clickable');
  }

  static async navigateToAngularPage(url_suffix: string): Promise<any> {
    console.log(`Navigating to ${this.angular_url}/#/${url_suffix}`);

    return await browser.get(`${this.angular_url}/#/${url_suffix}`);
  }

  static async waitForTextInUrl(text: string): Promise<any> {
    return browser.wait(until.urlContains(text), this.timeout)
  }

  static async clickOptionOfSelect(option: string, selectId: string): Promise<any> {
    console.log(`Getting option ${option} from select ${selectId}`);
    await this.waitForPresenceOfElementById(selectId);

    return await element(by.id(selectId)).element(by.id(option)).click();
  }

  static async waitForElementToBeClickableByName(name: string, timeout: number = this.timeout): Promise<boolean> {
    const until_: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until element is clickable ${name}`);
    const elem: ElementFinder = element(by.name(name));

    return await browser.driver.wait(until_.elementToBeClickable(elem), timeout, 'Element taking too long to be clickable');
  }
}
