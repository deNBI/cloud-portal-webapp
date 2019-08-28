import {browser, by, element, protractor, ProtractorExpectedConditions, until} from 'protractor';

export class Util {
  private static timeout: number = browser.params.timeout;
  private static auth: string = browser.params.login.auth;
  private static angular_url: string = browser.params.angular;


  static async waitForPage(url: string): Promise<boolean> {
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;
    console.log(`Waiting until page contains ${url}`);
    return await browser.driver.wait(until.urlContains(url), this.timeout);
  }

  static async waitForPresenceOfElement(id: string, timeout: number = this.timeout): Promise<boolean> {
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

    console.log(`Waiting until page contains element ${id}`);
    const elem = element(by.id(id));
    return await browser.driver.wait(until.presenceOf(elem), timeout, 'Element taking too long to appear in the DOM');
  }

  static async waitForPresenceByElement(elem: any, timeout: number = this.timeout): Promise<boolean> {
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

    console.log(`Waiting until page contains element by Elementfinder`);

    return await browser.driver.wait(until.presenceOf(elem), timeout, 'Element taking too long to appear in the DOM');
  }

  static async waitForElementToBeClickableById(id: string): Promise<boolean> {
    const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

    console.log(`Waiting until element is clickable ${id}`);
    const elem = element(by.id(id));
    return await browser.driver.wait(until.elementToBeClickable(elem), this.timeout, 'Element taking too long to be clickable');
  }

  static async navigateToAngularPage(url_suffix: string): Promise<any> {
    console.log(`Navigating to ${this.angular_url}/#/${url_suffix}`);

    return await browser.get(`${this.angular_url}/#/${url_suffix}`);
  }

  static async getOptionOfSelect(option: string, selectId: string): Promise<any> {
    return await element(by.id(selectId)).element(by.id(option)).click();
  }

}
