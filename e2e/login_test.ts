import ***REMOVED***browser***REMOVED*** from 'protractor';
import ***REMOVED***LoginPage***REMOVED*** from './page_objects/login.po';

describe('Login test', async function () ***REMOVED***
  let loginPage: LoginPage = new LoginPage();

  beforeAll(function () ***REMOVED***
    browser.waitForAngularEnabled(false);
    browser.get(browser.params.portal);
  ***REMOVED***);

  it('should be login page', async function () ***REMOVED***
    await loginPage.waitForLoginPage().then(function (result) ***REMOVED***
      expect(result).toEqual(true);
    ***REMOVED***);
  ***REMOVED***);

  it('should login', async function () ***REMOVED***
    loginPage.login(browser.params.login.email_user, browser.params.login.password_user);
    await loginPage.waitForPage('userinfo').then(function (result) ***REMOVED***
      expect(result).toEqual(true);
    ***REMOVED***);
  ***REMOVED***);

  it('should restart', async function () ***REMOVED***
    await loginPage.logOut();
    // browser.waitForAngularEnabled(false);
    // browser.get(browser.params.portal);
    loginPage = new LoginPage();
    await loginPage.waitForPage('data:,').then(function (result) ***REMOVED***
      expect(result).toEqual(true);
    ***REMOVED***);
  ***REMOVED***)
***REMOVED***);
