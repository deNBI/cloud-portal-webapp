// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {FormularPage} from '../page_objects/application_formular.po';
import {ApplicationOverviewPage} from '../page_objects/application_overview.po';
import {Util} from '../util';
import {FacilityOverviewPage} from '../page_objects/facility_overview.po';
import {ProjectOverview} from '../page_objects/project_overview.po';

describe('Member Test', function (): void {

  beforeAll(async function (): Promise<any> {
    await browser.waitForAngularEnabled(false);
    await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
  });

  it('should navigate to project overview', async function (): Promise<any> {
    await ProjectOverview.navigateToSimpleProjectverview();
  });

  it('should add member', async function (): Promise<any> {
    await ProjectOverview.addMemberToProject(Util.SIMPLE_VM_APPLICATION_NAME);
  });

  it('should remove member', async function (): Promise<any> {
    await ProjectOverview.removeMemberFromProject(Util.SIMPLE_VM_APPLICATION_NAME);
  });

});
