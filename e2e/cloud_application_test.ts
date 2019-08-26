// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from './page_objects/login.po';

describe('Application test', function () {
  let timeout: number = browser.params.timeout;
  let until = protractor.ExpectedConditions;

  beforeEach(async function () {
    browser.waitForAngularEnabled(false);
    browser.get(browser.params.portal);
    const loginPage: LoginPage = new LoginPage();
    await loginPage.login(browser.params.login.email_user, browser.params.login.password_user);
    timeout = browser.params.timeout;
    until = protractor.ExpectedConditions;
  });

  it('should send a cloud application', async function () {
    await browser.getCurrentUrl().then(function (url) {
      console.log('GetUrl: ' + url);
      url = url.substring(0, url.indexOf('#'));
      console.log('SubstringUrl: ' + url);
      console.log('AddedUrl: ' + url + '#/applications/newCloudApplication');
      browser.get(url + '#/applications/newCloudApplication');

    });
    console.log('Getting form.');
    const form_name = element(by.name('project_application_name'));
    await browser.wait(until.presenceOf(form_name), timeout).then(async function () {
      // fill  Formular
      element(by.name('project_application_name')).sendKeys('ProtractorTest');
      element(by.name('project_application_shortname')).sendKeys('ProtractorTest');
      element(by.name('project_application_description')).sendKeys('ProtractorTest Description');
      element(by.name('project_application_lifetime')).sendKeys('4');
      element(by.name('project_application_institute')).sendKeys('Proctractor Institute');
      element(by.name('project_application_workgroup')).sendKeys('Proctractor Workgroup');
      element(by.name('project_application_bmbf_project')).sendKeys('BMBF Project');
      element(by.name('project_application_elixir_project')).sendKeys('Elixir Project');
      element(by.name('project_application_horizon2020')).sendKeys('Horizon2020Project');
      element(by.id('id_project_application_report_allowed')).click();
      element(by.id('dissemination_information_accordion')).click();
      element(by.name('information_public_title_input')).sendKeys("A Public Title");
      element(by.id('public_description_enabled')).click();
      element(by.name('information_description')).sendKeys("A Public Description");
      element(by.id('information_resources_checkbox')).click();
      element(by.id('information_lifetime_checkbox')).click();
      element(by.id('information_project_type_checkbox')).click();
      element(by.id('information_pi_name_checkbox')).click();
      element(by.id('information_institution_checkbox')).click();
      element(by.id('information_workgroup_checkbox')).click();
      element(by.id('information_project_affiliation_checkbox')).click();
      element(by.id('platform_newsletter_checkbox')).click();
      element(by.id('platform_landing_page_checkbox')).click();
      element(by.id('platform_portal_news_checkbox')).click();
      element(by.id('platform_twitter_checkbox')).click();
      element(by.id('project_application_pi_approved_checkbox')).click();
      element(by.id('project_application_responsibility_checkbox')).click();


      const submitBtn = element(by.id('submit_btn'));
      await browser.wait(until.elementToBeClickable(submitBtn)).then(function () {
        submitBtn.click()
      });

    });


    // submit

    // Todo give verification Btn ID in Angular
    const verificationBtn = element(by.id('verification_btn'));
    await browser.wait(until.elementToBeClickable(verificationBtn), timeout).then(function () {
      verificationBtn.click()
    });
    browser.sleep(1000);
    // Todo give acknowledege btn id
    const acknowledgeBtn = element(by.id('acknowledge_approve_btn'));
    await browser.wait(until.elementToBeClickable(acknowledgeBtn), timeout).then(function () {
      acknowledgeBtn.click()

    });

    const redirectBtn = element(by.id('notification_btn_redirect'));
    await browser.wait(until.elementToBeClickable(redirectBtn), timeout).then(function () {
      redirectBtn.click()

    });
    console.log('got here');
    await browser.wait(until.urlContains('applications')).then(async function () {
      console.log('got here 2');
      var isProtractorApp = false;
      console.log(isProtractorApp);
      // todo give user_application table id
      await element.all(by.tagName('td')).each(function (element, index) {
        console.log('hello from element.all');
        element.getText().then(function (text) {
          console.log('hello from element.getText');
          console.log(text);
          if (text === 'ProtractorTest') {
            isProtractorApp = true;
          }
        })
      }).then(function () {
        expect(isProtractorApp).toEqual(true);
      })

    });
    console.log('got here 3');

  });
})
;
