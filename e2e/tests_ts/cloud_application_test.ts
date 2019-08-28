// spec.js
import ***REMOVED***browser, by, element, protractor***REMOVED*** from 'protractor';
import ***REMOVED***LoginPage***REMOVED*** from '../page_objects/login.po';
import ***REMOVED***FormularPage***REMOVED*** from "../page_objects/application_formular.po";
import ***REMOVED***ApplicationOverviewPage***REMOVED*** from "../page_objects/application_overview.po";
import ***REMOVED***Util***REMOVED*** from "../util";

describe('Cloud Application Test', function () ***REMOVED***

    beforeAll(async function () ***REMOVED***
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
    ***REMOVED***);

    it('should navigate to cloud application form', async function () ***REMOVED***
        console.log("Starting send a cloud  application test!");
        await FormularPage.navigateToCloudApplication();
    ***REMOVED***);

    it('should fill cloud application form', async function () ***REMOVED***

        await FormularPage.fillApplicationFormular(Util.OPENSTACK_APPLICATION_NAME);
    ***REMOVED***);


    it('should submit cloud application ', async function () ***REMOVED***

        await FormularPage.submitApplication();
        let isPresent: boolean = await ApplicationOverviewPage.isApplicationRequestPresent(Util.OPENSTACK_APPLICATION_NAME);
        expect(isPresent).toBeTruthy();
    ***REMOVED***);

    it('should have a cloud vm application in the application overview', async function () ***REMOVED***

        let isPresent: boolean = await ApplicationOverviewPage.isApplicationRequestPresent(Util.OPENSTACK_APPLICATION_NAME);
        expect(isPresent).toBeTruthy();
    ***REMOVED***);
***REMOVED***);
