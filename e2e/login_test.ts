import {browser} from 'protractor';
import {LoginPage} from './page_objects/login.po';

describe('Login test', async function () {
  let loginPage: LoginPage = new LoginPage();

  beforeAll(function () {
    browser.waitForAngularEnabled(false);
    browser.get(browser.params.portal);
  });

  it('should be login page', async function () {
    await loginPage.waitForLoginPage().then(function (result) {
      expect(result).toEqual(true);
    });
  });

  it('should login', async function () {
    loginPage.login(browser.params.login.email_user, browser.params.login.password_user);
    await loginPage.waitForPage('userinfo').then(function (result) {
      expect(result).toEqual(true);
    });
  });

  it('should restart', async function () {
    await loginPage.logOut();
    // browser.waitForAngularEnabled(false);
    // browser.get(browser.params.portal);
    loginPage = new LoginPage();
    await loginPage.waitForPage('data:,').then(function (result) {
      expect(result).toEqual(true);
    });
  })
});
