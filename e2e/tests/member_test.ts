// spec.js
import ***REMOVED***browser, by, element, protractor***REMOVED*** from 'protractor';
import ***REMOVED***LoginPage***REMOVED*** from '../page_objects/login.po';
import ***REMOVED***FormularPage***REMOVED*** from "../page_objects/application_formular.po";
import ***REMOVED***ApplicationOverviewPage***REMOVED*** from "../page_objects/application_overview.po";
import ***REMOVED***Util***REMOVED*** from "../util";
import ***REMOVED***FacilityOverviewPage***REMOVED*** from "../page_objects/facility_overview.po";
import ***REMOVED***ProjectOverview***REMOVED*** from "../page_objects/project_overview.po";

describe('Member Test', function () ***REMOVED***

    beforeAll(async function () ***REMOVED***
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
    ***REMOVED***);

    it('should navigate to project overview', async function () ***REMOVED***
        await ProjectOverview.navigateToSimpleProjectverview();
    ***REMOVED***);

    it('should add member', async function () ***REMOVED***
        await ProjectOverview.addMemberToProject(Util.SIMPLE_VM_APPLICATION_NAME);
    ***REMOVED***);

    it('should remove member', async function () ***REMOVED***
        await ProjectOverview.removeMemberFromProject(Util.SIMPLE_VM_APPLICATION_NAME);
    ***REMOVED***);

***REMOVED***);
