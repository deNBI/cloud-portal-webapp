// spec.js
import ***REMOVED***browser, by, element, protractor***REMOVED*** from 'protractor';
import ***REMOVED***LoginPage***REMOVED*** from './page_objects/login.po';

describe('Application test', function () ***REMOVED***
    let timeout: number = browser.params.timeout;
    let until = protractor.ExpectedConditions;

    beforeEach(async function () ***REMOVED***
        browser.waitForAngularEnabled(false);
        browser.get(browser.params.portal);
        const loginPage: LoginPage = new LoginPage();
        await loginPage.login(browser.params.login.email_user, browser.params.login.password_user);
        timeout = browser.params.timeout;
        until = protractor.ExpectedConditions;
    ***REMOVED***);

    it('should send a cloud application', async function () ***REMOVED***
        await browser.getCurrentUrl().then(function (url) ***REMOVED***
            console.log('GetUrl: ' + url);
            url = url.substring(0, url.indexOf('#'));
            console.log('SubstringUrl: ' + url);
            console.log('AddedUrl: ' + url + '#/applications/newCloudApplication');
            browser.get(url + '#/applications/newCloudApplication');

        ***REMOVED***);
        console.log('Getting form.');
        const form_name = element(by.name('project_application_name'));
        await browser.wait(until.presenceOf(form_name), timeout).then(async function () ***REMOVED***
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
            await browser.wait(until.elementToBeClickable(submitBtn)).then(function () ***REMOVED***
                submitBtn.click()
            ***REMOVED***);

        ***REMOVED***);


        // submit

        // Todo give verification Btn ID in Angular
        const verificationBtn = element(by.id('verification_btn'));
        await browser.wait(until.elementToBeClickable(verificationBtn), timeout).then(function () ***REMOVED***
            verificationBtn.click()
        ***REMOVED***);
        browser.sleep(1000);
        // Todo give acknowledege btn id
        const acknowledgeBtn = element(by.id('acknowledge_approve_btn'));
        await browser.wait(until.elementToBeClickable(acknowledgeBtn), timeout).then(function () ***REMOVED***
            acknowledgeBtn.click()

        ***REMOVED***);

        const redirectBtn = element(by.id('notification_btn_redirect'));
        await browser.wait(until.elementToBeClickable(redirectBtn), timeout).then(function () ***REMOVED***
            redirectBtn.click()

        ***REMOVED***);
        console.log('got here');
        await browser.wait(until.urlContains('applications')).then(async function () ***REMOVED***
            var own_applications = element(by.id("own_applications"));
            browser.wait(until.presenceOf(own_applications), timeout, 'Element taking too long to appear in the DOM');
            console.log('got here 2');
            var elm = element(by.id("ProtractorTest"));
            elm.isPresent().then(function (isPresent) ***REMOVED***
                expect(isPresent).toBeTruthy();
            ***REMOVED***);


        ***REMOVED***);
        console.log('got here 3');

    ***REMOVED***);
***REMOVED***)
;
