// spec.js
import ***REMOVED***browser, by, element, protractor***REMOVED*** from 'protractor';
import ***REMOVED***LoginPage***REMOVED*** from '../page_objects/login.po';
import ***REMOVED***FormularPage***REMOVED*** from "../page_objects/application_formular.po";
import ***REMOVED***ApplicationOverviewPage***REMOVED*** from "../page_objects/application_overview.po";
import ***REMOVED***Util***REMOVED*** from "../util";
import ***REMOVED***FacilityOverviewPage***REMOVED*** from "../page_objects/facility_overview.po";

describe('Cloud Application Approval Test', function () ***REMOVED***

    beforeAll(async function () ***REMOVED***
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
    ***REMOVED***);

    it('should navigate to application overview', async function () ***REMOVED***
        await ApplicationOverviewPage.navigateToApplicationOverview();


    ***REMOVED***);

    it('should approve cloud application with denbi default facility', async function () ***REMOVED***
        await ApplicationOverviewPage.approveCloudApplication(Util.OPENSTACK_APPLICATION_NAME);
    ***REMOVED***);

    it('should relog with facility manager', async function () ***REMOVED***
        await LoginPage.login(browser.params.login.email_fm, browser.params.login.password_fm, browser.params.login.auth_fm, true);
    ***REMOVED***);

    it('should navigate to facility overview', async function () ***REMOVED***
        await FacilityOverviewPage.navigateToFacilityOverview();
    ***REMOVED***);

    it('should approve cloud application', async function () ***REMOVED***
        await FacilityOverviewPage.approveApplication(Util.OPENSTACK_APPLICATION_NAME);
    ***REMOVED***);


***REMOVED***);
