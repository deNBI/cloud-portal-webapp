import ***REMOVED***browser, by, element, protractor, ProtractorExpectedConditions, until***REMOVED*** from 'protractor';

export class Util ***REMOVED***

  private static angular_url: string = browser.params.angular;
  public static timeout: number = browser.params.timeout;
  private static auth = browser.params.login.auth;
  private static _SIMPLE_VM_APPLICATION_NAME: string = "PTSimpleVM";
  private static _OPENSTACK_APPLICATION_NAME: string = "PTOpenStack";

  static get SIMPLE_VM_APPLICATION_NAME(): string ***REMOVED***
    return this._SIMPLE_VM_APPLICATION_NAME;
  ***REMOVED***

  static get OPENSTACK_APPLICATION_NAME(): string ***REMOVED***
    return this._OPENSTACK_APPLICATION_NAME;
  ***REMOVED***

  static async waitForPage(url: string): Promise<boolean> ***REMOVED***
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until page contains $***REMOVED***url***REMOVED***`);

    return await browser.driver.wait(until.urlContains(url), this.timeout);
  ***REMOVED***

  static async sendTextToElementByName(name: string, text: string, show_output: boolean = true): Promise<void> ***REMOVED***
    if (show_output) ***REMOVED***
      console.log(`Send text [$***REMOVED***text***REMOVED***] to element $***REMOVED***name***REMOVED***`);
    ***REMOVED***
    const elem = element(by.name(name));

    return await elem.sendKeys(text);
  ***REMOVED***

  static async sendTextToElementById(id: string, text: string, show_output: boolean = true): Promise<void> ***REMOVED***
    await this.waitForVisibilityOfElementById(id);
    if (show_output) ***REMOVED***
      console.log(`Send text [$***REMOVED***text***REMOVED***] to element $***REMOVED***id***REMOVED***`);
    ***REMOVED***
    const elem = element(by.id(id));

    return await elem.sendKeys(text);
  ***REMOVED***

  static async clickElementByName(name: string): Promise<void> ***REMOVED***
    await this.waitForElementToBeClickableByName(name);
    console.log(`Clicking element $***REMOVED***name***REMOVED***`);
    const elem = element(by.name(name));

    return await elem.click();
  ***REMOVED***

  static async clickElementByElement(elem: any,
                                     timeout: number = this.timeout,
                                     id: string = 'Elementfinder'): Promise<void> ***REMOVED***
    await this.waitForElementToBeClickableByElement(elem, timeout, id);
    console.log(`Clicking element $***REMOVED***id***REMOVED***`);

    return await elem.click();
  ***REMOVED***

  static async clickElementById(id: string): Promise<void> ***REMOVED***
    await this.waitForVisibilityOfElementById(id);
    await this.waitForElementToBeClickableById(id);
    console.log(`Clicking element $***REMOVED***id***REMOVED***`);
    const elem = element(by.id(id));

    return await elem.click();
  ***REMOVED***

  static async waitForTextPresenceInElementById(id: string, text: string, timeout: number = this.timeout): Promise<boolean> ***REMOVED***
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

    console.log(`Waiting until text [$***REMOVED***text***REMOVED***] appears in  element $***REMOVED***id***REMOVED***`);
    const elem = element(by.id(id));

    return await browser.driver.wait(until.textToBePresentInElement(elem, text), timeout, 'Text taking too long to appear in the Element');
  ***REMOVED***

  static async waitForPresenceOfElementById(id: string, timeout: number = this.timeout): Promise<boolean> ***REMOVED***
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until page contains element $***REMOVED***id***REMOVED***`);
    const elem = element(by.id(id));

    return await browser.driver.wait(until.presenceOf(elem), timeout, 'Element taking too long to appear in the DOM');
  ***REMOVED***

  static async waitForPresenceByElement(elem: any, timeout: number = this.timeout, id: string = 'Elementfinder'): Promise<boolean> ***REMOVED***
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until page contains element $***REMOVED***id***REMOVED***`);

    return await browser.driver.wait(until.presenceOf(elem), timeout, 'Element taking too long to appear in the DOM');
  ***REMOVED***

  static async waitForVisibilityOfElementById(id: string, timeout: number = this.timeout): Promise<boolean> ***REMOVED***
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

    console.log(`Waiting until element $***REMOVED***id***REMOVED*** is visibile`);
    const elem = element(by.id(id));

    return await browser.driver.wait(until.visibilityOf(elem), timeout, 'Element taking too long to be visibile');
  ***REMOVED***

  static async waitForInvisibilityOfElementByElement(elem: any,
                                                     timeout: number = this.timeout,
                                                     id: string = 'Elementfinder'): Promise<boolean> ***REMOVED***
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until element $***REMOVED***id***REMOVED*** is invisibile`);

    return await browser.driver.wait(until.invisibilityOf(elem), timeout, 'Element taking too long to be invisibile');
  ***REMOVED***

  static async waitForInvisibilityOfElementById(id: string, timeout: number = this.timeout): Promise<boolean> ***REMOVED***
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until element $***REMOVED***id***REMOVED*** is invisibile`);
    const elem: any = element(by.id(id));

    return await browser.driver.wait(until.invisibilityOf(elem), timeout, 'Element taking too long to be invisibile');
  ***REMOVED***

  static async waitForElementToBeClickableById(id: string, timeout: number = this.timeout): Promise<boolean> ***REMOVED***
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

    console.log(`Waiting until element is clickable $***REMOVED***id***REMOVED***`);
    const elem = element(by.id(id));
    return await browser.driver.wait(until.elementToBeClickable(elem), timeout, 'Element taking too long to be clickable');
  ***REMOVED***

  static async waitForElementToBeClickableByElement(
    elem: any,
    timeout: number = this.timeout,
    id: string = 'Elementfinder'): Promise<boolean> ***REMOVED***
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until element is clickable $***REMOVED***id***REMOVED***`);

    return await browser.driver.wait(until.elementToBeClickable(elem), timeout, 'Element taking too long to be clickable');
  ***REMOVED***

  static async navigateToAngularPage(url_suffix: string): Promise<any> ***REMOVED***
    console.log(`Navigating to $***REMOVED***this.angular_url***REMOVED***/#/$***REMOVED***url_suffix***REMOVED***`);

    return await browser.get(`$***REMOVED***this.angular_url***REMOVED***/#/$***REMOVED***url_suffix***REMOVED***`);
  ***REMOVED***

  static async getOptionOfSelect(option: string, selectId: string): Promise<any> ***REMOVED***
    console.log(`Getting option $***REMOVED***option***REMOVED*** from select $***REMOVED***selectId***REMOVED***`);

    return await element(by.id(selectId)).element(by.id(option)).click();
  ***REMOVED***

  static async waitForElementToBeClickableByName(name: string, timeout: number = this.timeout): Promise<boolean> ***REMOVED***
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until element is clickable $***REMOVED***name***REMOVED***`);
    const elem = element(by.name(name));

    return await browser.driver.wait(until.elementToBeClickable(elem), timeout, 'Element taking too long to be clickable');
  ***REMOVED***
***REMOVED***
