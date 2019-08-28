import {browser} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {Util} from '../util';

describe('Login test', async function () {

  beforeAll(function () {
    console.log('------------------------------Login test started');
    browser.waitForAngularEnabled(false);
    browser.get(browser.params.portal);
  });

  it('should login', async function () {
    LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user);
    await Util.waitForPage('userinfo').then(function (result) {
      expect(result).toEqual(true);
    });
  });

  it('should restart', async function () {
    await LoginPage.logOut();
    await Util.waitForPage('data:,').then(function (result) {
      expect(result).toEqual(true);
    });
  })
});
