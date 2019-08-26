// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from './page_objects/login.po';
import {FormularPage} from "./page_objects/application_formular.po";
import {ApplicationOverviewPage} from "./page_objects/application_overview.po";

describe('Simple Application Test', function () {
    const formularPage: FormularPage = new FormularPage();
    const applicationOverviewPage: ApplicationOverviewPage = new ApplicationOverviewPage();
    const loginPage: LoginPage = new LoginPage();


    beforeEach(async function () {
        browser.waitForAngularEnabled(false);
        await loginPage.login(browser.params.login.email_user, browser.params.login.password_user, true);
    });

    it('should send a simple vm application', async function () {
        await formularPage.navigateToSimpleVmApplication();
        console.log('Getting form.');
        await formularPage.fillFormular();

        await formularPage.submitApplication();
        applicationOverviewPage.isApplicationRequestPresent("ProtractorTest").then(function (isPresent) {
            expect(isPresent).toBeTruthy();

        });

    });
})
;
