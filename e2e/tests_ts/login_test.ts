import ***REMOVED***browser***REMOVED*** from 'protractor';
import ***REMOVED***LoginPage***REMOVED*** from '../page_objects/login.po';
import ***REMOVED***Util***REMOVED*** from '../util';

describe('Login test', async function () ***REMOVED***

    beforeAll(function () ***REMOVED***
        console.log('------------------------------Login test started');
        browser.waitForAngularEnabled(false);
        browser.get(browser.params.portal);
    ***REMOVED***);

    it('should login', async function () ***REMOVED***
        LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user);
        let result: boolean = await Util.waitForPage('userinfo');
        expect(result).toEqual(true);

    ***REMOVED***);

    it('should restart', async function () ***REMOVED***
        await LoginPage.logOut();
        let result: boolean = await Util.waitForPage('data:,');
        expect(result).toEqual(true);

    ***REMOVED***)
***REMOVED***);
