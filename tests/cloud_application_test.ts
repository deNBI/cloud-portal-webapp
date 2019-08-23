// spec.js
import ***REMOVED***browser, by, element, protractor***REMOVED*** from 'protractor';

describe('Application test', function () ***REMOVED***
    const timeout: number = browser.params.timeout;
    const until = protractor.ExpectedConditions;
    const auth = browser.params.login.auth;


    beforeEach(function () ***REMOVED***
        browser.waitForAngularEnabled(false);
        browser.get(browser.params.portal);
    ***REMOVED***);

    it('should be login page', function () ***REMOVED***

        browser.wait(until.urlContains('login.elixir-czech'), timeout).then(function (result) ***REMOVED***
            expect(result).toEqual(true);
        ***REMOVED***);
    ***REMOVED***);

    it('should login', function () ***REMOVED***
        if (auth === 'google') ***REMOVED***

            var el = element(by.className('metalist list-group'));
            el.click();
            // Input Email
            browser.wait(until.urlContains('accounts.google.com/signin/oauth/'), timeout).then(function () ***REMOVED***
                element(by.id('identifierId')).sendKeys(browser.params.login.email);
                // Click next btn
                element(by.id('identifierNext')).click();
            ***REMOVED***);

            browser.wait(until.urlContains('accounts.google.com/signin/v2/challenge'), timeout).then(function () ***REMOVED***
                const password = element(by.name('password'));
                browser.wait(until.elementToBeClickable(password), timeout).then(function () ***REMOVED***
                    element(by.name('password')).sendKeys(browser.params.login.password);
                    element(by.id('passwordNext')).click();
                ***REMOVED***)

            ***REMOVED***);

        ***REMOVED*** else ***REMOVED***
            element(by.id('query')).sendKeys('Bielefeld').then(function () ***REMOVED***
                element(by.linkText('University of Bielefeld')).click()
            ***REMOVED***);
            const pass = element(by.id('password'));
            browser.wait(until.elementToBeClickable(pass), timeout).then(function () ***REMOVED***
                element(by.id('username')).sendKeys(browser.params.login.email);
                element(by.id('password')).sendKeys(browser.params.login.password);
                element(by.name('_eventId_proceed')).click()

            ***REMOVED***);
            browser.wait(until.urlContains('execution=e1s2'), timeout).then(function () ***REMOVED***
                element(by.name('_eventId_proceed')).click()

            ***REMOVED***);

        ***REMOVED***
        const authorize = element(by.name('authorize'));
        browser.wait(until.elementToBeClickable(authorize), timeout).then(function () ***REMOVED***
            authorize.click();
        ***REMOVED***)

        browser.wait(until.urlContains('userinfo'), timeout, "UserInfo should be loaded!").then(function (result) ***REMOVED***
            expect(result).toEqual(true);
        ***REMOVED***);
    ***REMOVED***);


    it('should send a cloud application', function () ***REMOVED***
        browser.getCurrentUrl().then(function (url) ***REMOVED***
            url = url.substring(0, url.indexOf('#'));
            browser.get(url + '#/applications/newCloudApplication');

        ***REMOVED***);
        const form_name = element(by.name('project_application_name'));
        browser.wait(until.presenceOf(form_name), timeout).then(function () ***REMOVED***
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
            browser.wait(until.elementToBeClickable(submitBtn)).then(function () ***REMOVED***
                submitBtn.click()
            ***REMOVED***);

        ***REMOVED***);


        // submit

        // Todo give verification Btn ID in Angular
        const verificationBtn = element(by.id('verification_btn'));
        browser.wait(until.elementToBeClickable(verificationBtn), timeout).then(function () ***REMOVED***
            verificationBtn.click()
        ***REMOVED***);
        browser.sleep(1000);
        // Todo give acknowledege btn id
        const acknowledgeBtn = element(by.id('acknowledge_approve_btn'));
        browser.wait(until.elementToBeClickable(acknowledgeBtn), timeout).then(function () ***REMOVED***
            acknowledgeBtn.click()

        ***REMOVED***);

        const redirectBtn = element(by.id('notification_btn_redirect'));
        browser.wait(until.elementToBeClickable(redirectBtn), timeout).then(function () ***REMOVED***
            redirectBtn.click()

        ***REMOVED***)
        browser.wait(until.urlContains('applications')).then(function () ***REMOVED***
            browser.waitForAngularEnabled(true);

            var isProtractorApp = false;
            // todo give user_application table id
            element.all(by.tagName('td')).each(function (element, index) ***REMOVED***
                element.getText().then(function (text) ***REMOVED***
                    if (text === 'ProtractorTest')
                        isProtractorApp = true;
                    return false;
                ***REMOVED***)
            ***REMOVED***).then(function () ***REMOVED***
                expect(isProtractorApp).toEqual(true);
            ***REMOVED***)

        ***REMOVED***);

    ***REMOVED***);
***REMOVED***)
;
