// spec.js
import {browser, by, element, protractor} from 'protractor';

describe('Application test', function () {
  const timeout: number = browser.params.timeout;
  const until = protractor.ExpectedConditions;
  const auth = browser.params.login.auth;


  beforeEach(function () {
    browser.waitForAngularEnabled(false);
    browser.get(browser.params.portal);
  });

  it('should be login page', function () {

    browser.wait(until.urlContains('login.elixir-czech'), timeout).then(function (result) {
      expect(result).toEqual(true);
    });
  });

  it('should login', function () {
    if (auth === 'google') {

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

    } else {
      element(by.id('query')).sendKeys('Bielefeld').then(function () {
        element(by.linkText('University of Bielefeld')).click()
      });
      const pass = element(by.id('password'));
      browser.wait(until.elementToBeClickable(pass), timeout).then(function () {
        element(by.id('username')).sendKeys(browser.params.login.email);
        element(by.id('password')).sendKeys(browser.params.login.password);
        element(by.name('_eventId_proceed')).click()

      });
      browser.wait(until.urlContains('execution=e1s2'), timeout).then(function () {
        element(by.name('_eventId_proceed')).click()

      });

    }
    const authorize = element(by.name('authorize'));
    browser.wait(until.elementToBeClickable(authorize), timeout).then(function () {
      authorize.click();
    })

    browser.wait(until.urlContains('userinfo'), timeout).then(function (result) {
      expect(result).toEqual(true);
    });
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
    const submitBtn = element(by.className('btn btn-sm btn-success'));
    browser.wait(until.elementToBeClickable(submitBtn)).then(function () {
      submitBtn.click()
    });
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
})
;
