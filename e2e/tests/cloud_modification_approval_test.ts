// spec.js
import {browser} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {ApplicationOverviewPage} from '../page_objects/application_overview.po';
import {Util} from '../util';
import {FacilityOverviewPage} from '../page_objects/facility_overview.po';

describe('Simple Application Modification Approval Test', function (): void {

  beforeAll(async function (): Promise<any> {
    await browser.waitForAngularEnabled(false);
    await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
  });

  it('should navigate to application overview', async function (): Promise<any> {
    await ApplicationOverviewPage.navigateToApplicationOverview();
  });

  it('should approve a cloud  modification request', async function (): Promise<any> {
    await ApplicationOverviewPage.approveModificationRequest(Util.OPENSTACK_APPLICATION_NAME);
  });

  it('should relog with facility manager', async function (): Promise<any> {
    await LoginPage.login(browser.params.login.email_fm, browser.params.login.password_fm, browser.params.login.auth_fm, true);
  });

  it('should navigate to facility overview', async function (): Promise<any> {
    await FacilityOverviewPage.navigateToFacilityOverview();
  });

  it('should approve cloud application', async function (): Promise<any> {
    await FacilityOverviewPage.approveApplicationModification(Util.OPENSTACK_APPLICATION_NAME);
  });
});
