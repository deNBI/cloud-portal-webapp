// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from './page_objects/login.po';
import {FormularPage} from "./page_objects/application_formular.po";
import {ApplicationOverviewPage} from "./page_objects/application_overview.po";

describe('Cloud Application Test', function () {
    const formularPage: FormularPage = new FormularPage();
    const applicationOverviewPage: ApplicationOverviewPage = new ApplicationOverviewPage();
    const loginPage: LoginPage = new LoginPage();


    beforeEach(async function () {
        browser.waitForAngularEnabled(false);
        browser.get(browser.params.portal);
        await loginPage.login(browser.params.login.email_user, browser.params.login.password_user);
    });

    it('should send a cloud application', async function () {
        await browser.getCurrentUrl().then(function (url) {
            console.log('GetUrl: ' + url);
            url = url.substring(0, url.indexOf('#'));
            console.log('SubstringUrl: ' + url);
            console.log('AddedUrl: ' + url + '#/applications/newCloudApplication');
            browser.get(url + '#/applications/newCloudApplication');

        });
        console.log('Getting form.');
        await formularPage.fillFormular();

        await formularPage.submitApplication();
        applicationOverviewPage.isApplicationRequestPresent("ProtractorTest").then(function (isPresent) {
            expect(isPresent).toBeTruthy();

        });

    });
})
;
