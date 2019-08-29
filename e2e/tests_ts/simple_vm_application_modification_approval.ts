// spec.js
import ***REMOVED***browser, by, element, protractor***REMOVED*** from 'protractor';
import ***REMOVED***LoginPage***REMOVED*** from '../page_objects/login.po';
import ***REMOVED***FormularPage***REMOVED*** from "../page_objects/application_formular.po";
import ***REMOVED***ApplicationOverviewPage***REMOVED*** from "../page_objects/application_overview.po";
import ***REMOVED***Util***REMOVED*** from "../util";

describe('Simple Application Modification Approval Test', function () ***REMOVED***

    beforeAll(async function () ***REMOVED***
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
    ***REMOVED***);

     it('should navigate to application overview', async function () ***REMOVED***
        await ApplicationOverviewPage.navigateToApplicationOverview();
    ***REMOVED***);

    it('should approve a simple vm modification request', async function () ***REMOVED***
        await ApplicationOverviewPage.approveSVModificationRequest(Util.SIMPLE_VM_APPLICATION_NAME);
    ***REMOVED***);
***REMOVED***);
