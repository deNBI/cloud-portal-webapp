import ***REMOVED***browser, by, element, protractor, ProtractorExpectedConditions, until***REMOVED*** from 'protractor';

export class Util ***REMOVED***
  private static timeout: number = browser.params.timeout;
  private static auth: string = browser.params.login.auth;
  private static angular_url: string = browser.params.angular;


  static async waitForPage(url: string): Promise<boolean> ***REMOVED***
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until page contains $***REMOVED***url***REMOVED***`);
    return await browser.driver.wait(until.urlContains(url), this.timeout);
  ***REMOVED***

  static async waitForPresenceOfElement(id: string, timeout: number = this.timeout): Promise<boolean> ***REMOVED***
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

    console.log(`Waiting until page contains element $***REMOVED***id***REMOVED***`);
    const elem = element(by.id(id));
    return await browser.driver.wait(until.presenceOf(elem), timeout, 'Element taking too long to appear in the DOM');
  ***REMOVED***

  static async waitForPresenceByElement(elem: any, timeout: number = this.timeout): Promise<boolean> ***REMOVED***
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

    console.log(`Waiting until page contains element by Elementfinder`);

    return await browser.driver.wait(until.presenceOf(elem), timeout, 'Element taking too long to appear in the DOM');
  ***REMOVED***

  static async waitForElementToBeClickableById(id: string): Promise<boolean> ***REMOVED***
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

    console.log(`Waiting until element is clickable $***REMOVED***id***REMOVED***`);
    const elem = element(by.id(id));
    return await browser.driver.wait(until.elementToBeClickable(elem), this.timeout, 'Element taking too long to be clickable');
  ***REMOVED***

  static async navigateToAngularPage(url_suffix: string): Promise<any> ***REMOVED***
    console.log(`Navigating to $***REMOVED***this.angular_url***REMOVED***/#/$***REMOVED***url_suffix***REMOVED***`);

    return await browser.get(`$***REMOVED***this.angular_url***REMOVED***/#/$***REMOVED***url_suffix***REMOVED***`);
  ***REMOVED***

  static async getOptionOfSelect(option: string, selectId: string): Promise<any> ***REMOVED***
    return await element(by.id(selectId)).element(by.id(option)).click();
  ***REMOVED***

***REMOVED***
