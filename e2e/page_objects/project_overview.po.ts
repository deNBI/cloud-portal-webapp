import {Util} from '../util';
import {browser, by, element, protractor} from 'protractor';

export class ProjectOverview {

    private static PROJECT_OVERVIEW_URL: string = 'project-management';
    private static ADD_MEMBER_BTN_PREFIX: string = 'add_member_';
    private static SEARCH_MEMBER: string = 'add_member_input';
    private static DEFAULT_MEMBER: string = 'Test User';
    private static ADD_MEMBER_BTN: string = 'add_member_btn';
    private static SEARCH_MEMBERR_BTN: string = 'search_member_btn';
    private static SUCCESS: string = 'Success';
    private static ALL_MEMBERS_BTN: string = 'all_members_';
    private static REMOVE_MEMBER_PREFIX: string = 'remove_member_';
    private static NOTIFICATION_TITLE: string = 'notification_title';
    private static NOTIFICATION_CLOSE: string = 'close_notification';


    static async navigateToProjectverview(): Promise<any> {
        console.log('Navigating to project overview');
        await Util.navigateToAngularPage(this.PROJECT_OVERVIEW_URL);
    }

    static async addMemberToProject(application_name: string, member: string = this.DEFAULT_MEMBER): Promise<any> {
        console.log("Open add member modal");
        await Util.clickElementById(this.ADD_MEMBER_BTN_PREFIX + application_name);
        await Util.sendTextToElementById(this.SEARCH_MEMBER, member);
        await Util.clickElementById(this.SEARCH_MEMBERR_BTN);
        await Util.clickElementById(this.ADD_MEMBER_BTN);
        await Util.waitForTextPresenceInElementById(this.NOTIFICATION_TITLE, this.SUCCESS);
        console.log("Close Modal");
        await Util.clickElementById(this.NOTIFICATION_CLOSE)
        browser.sleep(1000);

    }

    static async removeMemberFromProject(application_name: string, member: string = this.DEFAULT_MEMBER): Promise<any> {
        console.log("Open all member modal");
        await Util.clickElementById(this.ALL_MEMBERS_BTN + application_name);
        await Util.clickElementById(this.REMOVE_MEMBER_PREFIX + member);
        await Util.waitForTextPresenceInElementById(this.NOTIFICATION_TITLE, this.SUCCESS);
        console.log("Close Modal");

        await Util.clickElementById(this.NOTIFICATION_CLOSE)
        browser.sleep(1000);


    }


}
