// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {FormularPage} from '../page_objects/application_formular.po';
import {ApplicationOverviewPage} from '../page_objects/application_overview.po';
import {Util} from '../util';
import {FacilityOverviewPage} from '../page_objects/facility_overview.po';

describe('Simple Application Modification Approval Test', function () {

    beforeAll(async function () {
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
    });

    it('should navigate to application overview', async function () {
        await ApplicationOverviewPage.navigateToApplicationOverview();
    });

    it('should approve a cloud  modification request', async function () {
        await ApplicationOverviewPage.approveOPModificationRequest(Util.OPENSTACK_APPLICATION_NAME);
    });

    it('should relog with facility manager', async function () {
        await LoginPage.login(browser.params.login.email_fm, browser.params.login.password_fm, browser.params.login.auth_fm, true);
    });

    it('should navigate to facility overview', async function () {
        await FacilityOverviewPage.navigateToFacilityOverview();
    });

    it('should approve cloud application', async function () {
        await FacilityOverviewPage.approveApplicationExtension(Util.OPENSTACK_APPLICATION_NAME);
    });
});
