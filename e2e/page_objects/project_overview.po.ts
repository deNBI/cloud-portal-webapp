import ***REMOVED***Util***REMOVED*** from '../util';
import ***REMOVED***browser, by, element, protractor***REMOVED*** from 'protractor';

export class ProjectOverview ***REMOVED***

  private static PROJECT_OVERVIEW_URL: string = 'project-management';
  private static ADD_MEMBER_BTN_MODAL: string = 'add_member_btn_modal';
  private static SEARCH_MEMBER: string = 'add_member_input';
  private static DEFAULT_MEMBER: string = 'Test User';
  private static ADD_MEMBER_BTN: string = 'add_member_btn';
  private static SEARCH_MEMBER_BTN: string = 'search_member_btn';
  private static SUCCESS: string = 'Success';
  private static ALL_MEMBERS_BTN: string = 'all_members_';
  private static REMOVE_MEMBER_PREFIX: string = 'remove_member_';
  private static NOTIFICATION_TITLE: string = 'notification_title';
  private static NOTIFICATION_CLOSE: string = 'close_notification';

  static async navigateToSimpleProjectverview(): Promise<any> ***REMOVED***
    console.log('Navigating to simple project overview');
    await Util.clickElementById(Util.SIMPLE_VM_APPLICATION_NAME)
  ***REMOVED***

  static async navigateToOpenStackeProjectverview(): Promise<any> ***REMOVED***
    console.log('Navigating to openstack project overview');
    await Util.clickElementById(Util.OPENSTACK_APPLICATION_NAME)
  ***REMOVED***

  static async addMemberToProject(application_name: string, member: string = this.DEFAULT_MEMBER): Promise<any> ***REMOVED***
    console.log('Open add member modal');
    await Util.clickElementById(this.ADD_MEMBER_BTN_MODAL);
    await Util.sendTextToElementById(this.SEARCH_MEMBER, member);
    await Util.clickElementById(this.SEARCH_MEMBER_BTN);
    await Util.clickElementById(this.ADD_MEMBER_BTN);
    await Util.waitForTextPresenceInElementById(this.NOTIFICATION_TITLE, this.SUCCESS);
    console.log('Close Modal');
    await Util.clickElementById(this.NOTIFICATION_CLOSE);
    browser.sleep(1000);

  ***REMOVED***

  static async removeMemberFromProject(application_name: string, member: string = this.DEFAULT_MEMBER): Promise<any> ***REMOVED***
    await Util.clickElementById(this.REMOVE_MEMBER_PREFIX + member);
    await Util.waitForTextPresenceInElementById(this.NOTIFICATION_TITLE, this.SUCCESS);
    console.log('Close Modal');

    await Util.clickElementById(this.NOTIFICATION_CLOSE)
    browser.sleep(1000);

  ***REMOVED***

***REMOVED***
