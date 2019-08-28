// spec.js
import ***REMOVED***browser, by, element, protractor***REMOVED*** from 'protractor';
import ***REMOVED***LoginPage***REMOVED*** from '../page_objects/login.po';
import ***REMOVED***FormularPage***REMOVED*** from "../page_objects/application_formular.po";
import ***REMOVED***ApplicationOverviewPage***REMOVED*** from "../page_objects/application_overview.po";
import ***REMOVED***Util***REMOVED*** from "../util";

describe('Simple Application Modification Test', function () ***REMOVED***

    beforeEach(async function () ***REMOVED***
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
    ***REMOVED***);

    it('should send a modification request', async function () ***REMOVED***
        console.log("Starting send a simple vm modification request  test!");
        await ApplicationOverviewPage.navigateToApplicationOverview();
        await ApplicationOverviewPage.sendModificationRequest(Util.SIMPLE_VM_APPLICATION_NAME);
    ***REMOVED***);
***REMOVED***);
