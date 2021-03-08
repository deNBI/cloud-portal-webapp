// spec.js
import {browser} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {VoOverviewPage} from '../page_objects/vo_overview.po';
import {Util} from '../util';
import {FmProjectsOverview} from '../page_objects/fm_project_overview.po';

describe('Simple Application Test', function (): void {

  beforeAll(async function (): Promise<any> {
    await browser.waitForAngularEnabled(false);
    await LoginPage.login(browser.params.login.email_vo, browser.params.login.password_vo, browser.params.login.auth_vo, true);
  });

  it('should navigate to the vo overview', async function (): Promise<any> {
    Util.logDebug('Starting terminate simple vm application test');
    await VoOverviewPage.navigateToVolumeOverview();
  });

  it('should filter projects', async function (): Promise<any> {
    await VoOverviewPage.filterForPTProjets();

  });

  it('should terminate vo projects', async function (): Promise<any> {
    await VoOverviewPage.getAllPTProjects();

  });

  it('should navigate to the fm projects', async function (): Promise<any> {
    await FmProjectsOverview.navigateToFMProjectsOverview()

  });

  it('should filter projects', async function (): Promise<any> {
    await FmProjectsOverview.filterForPTProjets();

  });

  it('should terminate vo projects', async function (): Promise<any> {
    await FmProjectsOverview.getAllPTProjects();

  });

});
