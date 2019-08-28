// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {FormularPage} from "../page_objects/application_formular.po";
import {ApplicationOverviewPage} from "../page_objects/application_overview.po";
import {Util} from "../util";

describe('Simple Application Test', function () {

    beforeEach(async function () {
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user,browser.params.login.auth_user, false);
    });

    it('should send a simple vm application', async function () {
        await FormularPage.navigateToSimpleVmApplication();
        console.log('Getting form.');
        await FormularPage.fillFormular(Util.SIMPLE_VM_APPLICATION_NAME);

        await FormularPage.submitApplication();
        let isPresent: boolean = await ApplicationOverviewPage.isApplicationRequestPresent(Util.SIMPLE_VM_APPLICATION_NAME);
        expect(isPresent).toBeTruthy();

    });
});
