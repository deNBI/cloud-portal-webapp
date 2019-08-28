// spec.js
import ***REMOVED***browser, by, element, protractor***REMOVED*** from 'protractor';
import ***REMOVED***LoginPage***REMOVED*** from '../page_objects/login.po';
import ***REMOVED***FormularPage***REMOVED*** from "../page_objects/application_formular.po";
import ***REMOVED***ApplicationOverviewPage***REMOVED*** from "../page_objects/application_overview.po";
import ***REMOVED***Util***REMOVED*** from "../util";

describe('Simple Application Approval Test', function () ***REMOVED***

    beforeEach(async function () ***REMOVED***
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
    ***REMOVED***);

    it('should approve A SIMPLE VM APPLICATION', async function () ***REMOVED***
        await ApplicationOverviewPage.navigateToApplicationOverview();

        await ApplicationOverviewPage.approveSimpleVm(Util.SIMPLE_VM_APPLICATION_NAME);
        await Util.waitForTextPresenceInElementById('notification_message', "The new project was created and assigned to de.NBI Cloud Portal - Development.");
        const elem = element(by.id('notification_message'));
        console.log(await elem.getText());


    ***REMOVED***);
***REMOVED***);
