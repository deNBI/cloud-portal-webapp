// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {FormularPage} from "../page_objects/application_formular.po";
import {ApplicationOverviewPage} from "../page_objects/application_overview.po";
import {Util} from "../util";

describe('Simple Application Modification Test', function () {

    beforeEach(async function () {
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
    });

    it('should send a modification request', async function () {
        console.log("Starting send a simple vm modification request  test!");
        await ApplicationOverviewPage.navigateToApplicationOverview();
        await ApplicationOverviewPage.sendModificationRequest(Util.SIMPLE_VM_APPLICATION_NAME);
    });
});
