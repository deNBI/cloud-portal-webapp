// spec.js
import {browser} from 'protractor';
import {LoginPage} from '../page_objects/login.po';
import {ProfilePage} from '../page_objects/profile_page.po';

describe('Public Key Test', function(): void {

  beforeAll(async function(): Promise<any> {
    await browser.waitForAngularEnabled(false);
    await LoginPage.login(browser.params.login.email_user, browser.params.login.password_user, browser.params.login.auth_user, true);
  });

  it('should generate a new ssh-keypair', async function(): Promise<any> {
    const pubKeyText= await ProfilePage.generateNewKeyPair();
    expect(pubKeyText).toContain('ecdsa');
  });

  it('should set a new ssh-keypair without previous generation', async function(): Promise<any> {
    const pubKeyText = await ProfilePage.setNewPublicKey();
    expect(pubKeyText).toContain('ssh-rsa');
  });
});
