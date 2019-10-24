// spec.js
import {browser, by, element, protractor} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {FormularPage} from '../page_objects/application_formular.po';
import {ApplicationOverviewPage} from '../page_objects/application_overview.po';
import {Util} from '../util';
import {ProjectOverview} from '../page_objects/project_overview.po';

describe('Cloud ApplicationModification Test', function (): void {

  beforeAll(async function (): Promise<any> {
    await browser.waitForAngularEnabled(false);
    await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
  });

  it('should navigate to openstack project overview', async function (): Promise<any> {
    await ProjectOverview.navigateToOpenStackeProjectverview();
  });

  it('should open the modification request modal', async function (): Promise<any> {
    await ProjectOverview.openModificationModal(Util.OPENSTACK_APPLICATION_NAME);
  });

  it('should have old values prefilled', async function (): Promise<any> {
    await ProjectOverview.areDefaultValuesSetOpenstack();
  });

  it('should fill modification formular', async function (): Promise<any> {
    await ProjectOverview.fillModificationRequest();
  });

  it('should have total ram and cores right', async function (): Promise<any> {
    await ProjectOverview.checkTotalCoresRam();
  });

  it('should send a modification request', async function (): Promise<any> {
    await ProjectOverview.sendModificationRequest(Util.OPENSTACK_APPLICATION_NAME);
  });
});
