// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {FormularPage} from "../page_objects/application_formular.po";
import {ApplicationOverviewPage} from "../page_objects/application_overview.po";
import {Util} from "../util";

describe('Simple Application Modification Test', function () {

    beforeEach(async function () {
        await browser.waitForAngularEnabled(false);
        await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
    });

    it('should send a modification request', async function () {
        await ApplicationOverviewPage.navigateToApplicationOverview();
        await Util.waitForElementToBeClickableById('extension_' + Util.SIMPLE_VM_APPLICATION_NAME);

        await ApplicationOverviewPage.approveSimpleVm(Util.SIMPLE_VM_APPLICATION_NAME);
        await Util.waitForTextPresenceInElementById('notification_message', "The new project was created and assigned to de.NBI Cloud Portal - Development.");
        const elem = element(by.id('notification_message'));
        console.log(await elem.getText());


    });
});
