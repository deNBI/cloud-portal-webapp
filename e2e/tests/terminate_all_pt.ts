// spec.js
import {browser} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {VoOverviewPage} from '../page_objects/vo_overview.po';
import {ApplicationOverviewPage} from '../page_objects/application_overview.po';
import {FacilityOverviewPage} from '../page_objects/facility_overview.po';

describe('Simple Application Test', function (): void {

  beforeAll(async function (): Promise<any> {
    await browser.waitForAngularEnabled(false);
    await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
  });

  it('should decline all open PT Applications', async function (): Promise<any> {

    await ApplicationOverviewPage.navigateToApplicationOverview();
    await ApplicationOverviewPage.declinePTApplications();
  });

  it('should navigate to the vo overview', async function (): Promise<any> {
    await VoOverviewPage.navigateToVolumeOverview();
  });

  it('should filter projects', async function (): Promise<any> {
    await VoOverviewPage.filterForPTProjets();

  });

  it('should terminate vo projects', async function (): Promise<any> {
    await VoOverviewPage.terminateAllPTProjects();

  });

  it('should navigate to the fm applications', async function (): Promise<any> {
    await FacilityOverviewPage.navigateToFacilityOverview()

  });

  it('should terminate fm projects', async function (): Promise<any> {
    await FacilityOverviewPage.terminatePTApplications();

  });

});
