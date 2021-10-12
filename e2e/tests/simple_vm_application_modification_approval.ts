// spec.js
import {browser} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {ApplicationOverviewPage} from '../page_objects/application_overview.po';
import {Util} from '../util';

describe('Simple Application Modification Approval Test', function (): void {

  beforeAll(async function (): Promise<any> {
    await browser.waitForAngularEnabled(false);
    await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
  });

  it('should navigate to application overview', async function (): Promise<any> {
    await ApplicationOverviewPage.navigateToApplicationOverview();
  });

  it('should approve a simple vm modification request', async function (): Promise<any> {
    await ApplicationOverviewPage.approveSimpleVMModificationRequest(Util.SIMPLE_VM_APPLICATION_NAME);
  });
});
