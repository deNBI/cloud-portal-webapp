// spec.js
import {browser, by, element, protractor} from 'protractor';

describe('Application test', function () {
  const timeout: number = browser.params.timeout;
  const until = protractor.ExpectedConditions;


  beforeEach(function () {
    browser.waitForAngularEnabled(false);
    browser.get('https://portal-dev.denbi.de/portal/');
  });

  it('should be login page', function () {

    browser.wait(until.urlContains('login.elixir-czech'), timeout).then(function (result) {
      expect(result).toEqual(true);
    });
  });

  it('should login', function () {
    var el = element(by.className('metalist list-group'));
    el.click();
    // Input Email
    browser.wait(until.urlContains('accounts.google.com/signin/oauth/'), timeout).then(function () {
      element(by.id('identifierId')).sendKeys(browser.params.login.email);
      // Click next btn
      element(by.id('identifierNext')).click();
    });

    browser.wait(until.urlContains('accounts.google.com/signin/v2/challenge'), timeout).then(function () {
      const password = element(by.name('password'));
      browser.wait(until.elementToBeClickable(password), timeout).then(function () {
        element(by.name('password')).sendKeys(browser.params.login.password);
        element(by.id('passwordNext')).click();
      })

    });

    const authorize = element(by.name('authorize'));
    browser.wait(until.elementToBeClickable(authorize), timeout).then(function () {
      authorize.click();
    })

    browser.wait(until.urlContains('userinfo'), timeout).then(function (result) {
      expect(result).toEqual(true);
    });


    // Input password
  });


  it('should send a cloud application', function () {
    browser.get('https://portal-dev.denbi.de/portal/webapp/#/applications/newCloudApplication');
    browser.wait(until.urlContains('applications/newCloudApplication'), timeout);

    // fill  Formular
    element(by.name('project_application_name')).sendKeys('ProtractorTest');
    element(by.name('project_application_shortname')).sendKeys('ProtractorTest');
    element(by.name('project_application_description')).sendKeys('ProtractorTest Description');
    element(by.name('project_application_lifetime')).sendKeys('4');
    element(by.name('project_application_institute')).sendKeys('Proctractor Institute');
    element(by.name('project_application_workgroup')).sendKeys('Proctractor Workgroup');
    // submit
    element(by.className('btn btn-sm btn-success')).click();
    // Todo give verification Btn ID in Angular
    const verificationBtn = element(by.className('btn btn-success col-md4'));
    browser.wait(until.elementToBeClickable(verificationBtn), timeout).then(function () {
      element(by.className('btn btn-success col-md4')).click()
    });
    // Todo give acknowledege btn id
    const acknowledgeBtn = element(by.name('_save'));
    browser.wait(until.elementToBeClickable(acknowledgeBtn), timeout).then(function () {
      element(by.name('_save')).click()

    });

    const redirectBtn = element(by.className('btn btn-secondary'));
    browser.wait(until.elementToBeClickable(redirectBtn), timeout).then(function () {
      element(by.className('btn btn-secondary')).click()

    })
    browser.wait(until.urlContains('applications')).then(function () {
      browser.waitForAngularEnabled(true);

      var isProtractorApp = false;
      // todo give user_application table id
      element.all(by.tagName('td')).each(function (element, index) {
        element.getText().then(function (text) {
          if (text === 'ProtractorTest')
            isProtractorApp = true;
          return false;
        })
      }).then(function () {
        expect(isProtractorApp).toEqual(true);
      })

    });

  });
});
