// spec.js
import ***REMOVED***browser, by, element, protractor***REMOVED*** from 'protractor';
import ***REMOVED***LoginPage***REMOVED*** from './page_objects/login.po';
import ***REMOVED***FormularPage***REMOVED*** from "./page_objects/application_formular.po";
import ***REMOVED***ApplicationOverviewPage***REMOVED*** from "./page_objects/application_overview.po";

describe('Simple Application Test', function () ***REMOVED***
    const applicationOverviewPage: ApplicationOverviewPage = new ApplicationOverviewPage();
    const loginPage: LoginPage = new LoginPage();


    beforeEach(async function () ***REMOVED***
        browser.waitForAngularEnabled(false);
        await loginPage.login(browser.params.login.email_user, browser.params.login.password_user, true);
    ***REMOVED***);

    it('should send a simple vm application', async function () ***REMOVED***
        await FormularPage.navigateToSimpleVmApplication();
        console.log('Getting form.');
        await FormularPage.fillFormular();

        await FormularPage.submitApplication();
        applicationOverviewPage.isApplicationRequestPresent("ProtractorTest").then(async function (isPresent) ***REMOVED***
            expect(isPresent).toBeTruthy();

        ***REMOVED***);

    ***REMOVED***);
***REMOVED***);
