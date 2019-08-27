// spec.js
import ***REMOVED***browser, by, element, protractor***REMOVED*** from 'protractor';
import ***REMOVED***LoginPage***REMOVED*** from './page_objects/login.po';
import ***REMOVED***FormularPage***REMOVED*** from "./page_objects/application_formular.po";
import ***REMOVED***ApplicationOverviewPage***REMOVED*** from "./page_objects/application_overview.po";

describe('Simple Application Test', function () ***REMOVED***
    
    beforeEach(async function () ***REMOVED***
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, true);
    ***REMOVED***);

    it('should send a simple vm application', async function () ***REMOVED***
        await FormularPage.navigateToSimpleVmApplication();
        console.log('Getting form.');
        await FormularPage.fillFormular();

        await FormularPage.submitApplication();
        let isPresent: boolean = await ApplicationOverviewPage.isApplicationRequestPresent("ProtractorTest");
        expect(isPresent).toBeTruthy();

    ***REMOVED***);
***REMOVED***);
