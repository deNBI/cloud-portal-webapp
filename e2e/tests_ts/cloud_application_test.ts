// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {FormularPage} from "../page_objects/application_formular.po";
import {ApplicationOverviewPage} from "../page_objects/application_overview.po";
import {Util} from "../util";

describe('Cloud Application Test', function () {

    beforeAll(async function () {
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
    });

    it('should navigate to cloud application form', async function () {
        console.log("Starting send a cloud  application test!");
        await FormularPage.navigateToCloudApplication();
    });

    it('should fill cloud application form', async function () {

        await FormularPage.fillApplicationFormular(Util.OPENSTACK_APPLICATION_NAME);
    });


    it('should submit cloud application ', async function () {

        await FormularPage.submitApplication();
        let isPresent: boolean = await ApplicationOverviewPage.isApplicationRequestPresent(Util.OPENSTACK_APPLICATION_NAME);
        expect(isPresent).toBeTruthy();
    });

    it('should have a cloud vm application in the application overview', async function () {

        let isPresent: boolean = await ApplicationOverviewPage.isApplicationRequestPresent(Util.OPENSTACK_APPLICATION_NAME);
        expect(isPresent).toBeTruthy();
    });
});
