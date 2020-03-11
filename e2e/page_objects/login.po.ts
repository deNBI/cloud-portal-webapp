import {browser, by, element} from 'protractor';
import {Util} from '../util';

/**
 * LoginPage.
 */
export class LoginPage {
  private static timeout: number = browser.params.timeout;

  static async login(email: string, psw: string, auth: string, relog: boolean = false): Promise<any> {

    await browser.driver.get(browser.params.portal);

    console.log('Login');

    const current_url: any = await browser.driver.getCurrentUrl();
    console.log(current_url);
    if (relog && current_url.includes('userinfo')) {
      console.log('Need to relog');
      await this.logOut();
      await browser.waitForAngularEnabled(false);
      await LoginPage.login(email, psw, auth)
    } else if (auth === 'google') {
      console.log('Login with Google');
      await this.useGoogle(email, psw);
    } else {
      console.log('Login with University of Bielefeld');
      await this.useUni(email, psw);
    }
    console.log('Checking login success.');
    await Util.waitForPage('userinfo');
  }

  static async useGoogle(email: string, psw: string): Promise<any> {
    await element(by.className('metalist list-group')).click();
    // Input Email
    await Util.waitForPage('accounts.google.com/signin/oauth/');
    await Util.sendTextToElementById('identifierId', email, false);

    // Click next btn
    await Util.clickElementById('identifierNext');
    await Util.waitForPage('accounts.google.com/signin/v2/challenge');
    await Util.waitForElementToBeClickableById('password');
    await Util.sendTextToElementByName('password', psw, false);
    await Util.clickElementById('passwordNext');
    await Util.waitForPage('userinfo');

  }

  static async useUni(email: string, psw: string): Promise<any> {
    await Util.waitForPresenceOfElementById('query');
    await Util.sendTextToElementById('query', 'Bielefeld');
    await element(by.linkText('University of Bielefeld')).click();
    await Util.waitForElementToBeClickableById('password');
    await Util.sendTextToElementById('username', email, false);
    await Util.sendTextToElementById('password', psw, false);
    await Util.clickElementByName('_eventId_proceed');
    await Util.waitForPage('execution=e1s2');
    await Util.clickElementByName('_eventId_proceed');
    await Util.waitForPage('userinfo');
  }

  static async logOut(): Promise<any> {
    console.log('Restarting browser');
    await browser.restart();
    await browser.waitForAngularEnabled(false);
    await browser.manage().window().setSize(browser.params.width, browser.params.height);
  }
}
