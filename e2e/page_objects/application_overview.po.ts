import {by, element, browser} from 'protractor';
import {Util} from "../util";

export class ApplicationOverviewPage {
    private static OWN_APPLICATION_ID: string = "own_applications";
    private static APPLICATION_FOR_REVIEW_ID: string = "applications_for_review";


    static async navigateToApplicationOverview(): Promise<any> {
        console.log("Navigate to Application Overview form");
        let url = await browser.driver.getCurrentUrl();
        console.log('GetUrl: ' + url);
        url = url.substring(0, url.indexOf('#'));
        console.log('SubstringUrl: ' + url);
        console.log('AddedUrl: ' + url + '#/applications');

        await browser.driver.get(url + '#/applications');
        await Util.waitForPage('#/applications');
    }


    static async isApplicationRequestPresent(application_name: string): Promise<boolean> {
        await Util.waitForPage('applications');
        await Util.waitForPresenceOfElement(this.OWN_APPLICATION_ID);
        const elm = element(by.id(application_name));

        return await elm.isPresent()
    }

    static async approveSimpleVm(application_name: string): Promise<any> {
        await Util.waitForPage('applications');
        return await Util.clickElementById(application_name);

    }


}
