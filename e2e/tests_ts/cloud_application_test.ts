// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {FormularPage} from "../page_objects/application_formular.po";
import {ApplicationOverviewPage} from "../page_objects/application_overview.po";
import {Util} from "../util";

describe('Cloud Application Test', function () {

    beforeEach(async function () {
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user,browser.params.login.auth_user, true);
    });

    it('should send a cloud application', async function () {
        await FormularPage.navigateToCloudApplication();
        await FormularPage.fillFormular(Util.OPENSTACK_APPLICATION_NAME);
        await FormularPage.submitApplication();
        let isPresent: boolean = await ApplicationOverviewPage.isApplicationRequestPresent(Util.OPENSTACK_APPLICATION_NAME);
        expect(isPresent).toBeTruthy();
    });
})
;
