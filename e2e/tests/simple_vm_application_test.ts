// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {FormularPage} from '../page_objects/application_formular.po';
import {ApplicationOverviewPage} from '../page_objects/application_overview.po';
import {Util} from '../util';

describe('Simple Application Test', function () {

  beforeAll(async function () {
    await browser.waitForAngularEnabled(false);
    await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
  });

  it('should navigate to the simple vm form', async function () {
    console.log('Starting send a simple vm application test!');
    await FormularPage.navigateToSimpleVmApplication();
  });

  it('should fill the simple vm form', async function () {
    await FormularPage.fillApplicationFormular(Util.SIMPLE_VM_APPLICATION_NAME);

  });

  it('should submit the simple vm form', async function () {
    await FormularPage.submitApplication();

  });

  it('should successfully submitted the application', async function () {

    const isPresent: boolean = await FormularPage.isApplicationSubmitted();
    expect(isPresent).toBeTruthy();
  });

});
