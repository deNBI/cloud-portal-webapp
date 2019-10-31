import {browser} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {Util} from '../util';

describe('Login test', async function (): Promise<any> {

  beforeAll(async function (): Promise<void> {
    console.log('------------------------------Login test started');
    await browser.waitForAngularEnabled(false);
    await browser.get(browser.params.portal);
  });

  it('should login', async function (): Promise<any> {
    await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user);
    const result: boolean = await Util.waitForPage('userinfo');
    expect(result).toEqual(true);

  });

  it('should restart', async function (): Promise<any> {
    await LoginPage.logOut();
    const result: boolean = await Util.waitForPage('data:,');
    expect(result).toEqual(true);

  })
});
