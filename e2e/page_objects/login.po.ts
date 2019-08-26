import ***REMOVED***browser, by, element, protractor, ProtractorExpectedConditions***REMOVED*** from 'protractor';

export class LoginPage ***REMOVED***
  private timeout: number = browser.params.timeout;
  private until: ProtractorExpectedConditions = protractor.ExpectedConditions;
  private auth = browser.params.login.auth;

  async waitForLoginPage(): Promise<boolean> ***REMOVED***
    console.log('Waiting for login page');

    return this.waitForPage('login.elixir-czech');
  ***REMOVED***

  async login(email: string, psw: string): Promise<any> ***REMOVED***
    if (this.auth === 'google') ***REMOVED***
      console.log('Login with Google');
      this.useGoogle(email, psw);
    ***REMOVED*** else ***REMOVED***
      console.log('Login with University of Bielefeld');
      this.useUni(email, psw);
    ***REMOVED***
  ***REMOVED***

  useGoogle(email: string, psw: string): any ***REMOVED***
    const el = element(by.className('metalist list-group'));
    el.click();
    // Input Email
    this.waitForPage('accounts.google.com/signin/oauth/').then(function () ***REMOVED***
      element(by.id('identifierId')).sendKeys(email);
      // Click next btn
      element(by.id('identifierNext')).click();
    ***REMOVED***);

    this.waitForPage('accounts.google.com/signin/v2/challenge').then(function () ***REMOVED***
      const password = element(by.name('password'));
      browser.wait(this.this.until.elementToBeClickable(password), this.this.timeout).then(function () ***REMOVED***
        element(by.name('password')).sendKeys(psw);
        element(by.id('passwordNext')).click();
      ***REMOVED***)
    ***REMOVED***);
  ***REMOVED***

  useUni(email: string, psw: string): any ***REMOVED***
    element(by.id('query')).sendKeys('Bielefeld').then(function () ***REMOVED***
      element(by.linkText('University of Bielefeld')).click()
    ***REMOVED***);
    const pass = element(by.id('password'));
    browser.wait(this.until.elementToBeClickable(pass), this.timeout).then(function () ***REMOVED***
      element(by.id('username')).sendKeys(email);
      element(by.id('password')).sendKeys(psw);
      element(by.name('_eventId_proceed')).click();
    ***REMOVED***);
    this.waitForPage('execution=e1s2').then(function () ***REMOVED***
      element(by.name('_eventId_proceed')).click()
    ***REMOVED***);
  ***REMOVED***

  async waitForPage(url: string): Promise<boolean> ***REMOVED***
    console.log(`Waiting until page contains $***REMOVED***url***REMOVED***`);

    return await browser.wait(this.until.urlContains(url), this.timeout);
  ***REMOVED***

  async logOut(): Promise<any> ***REMOVED***
    console.log('Restarting browser');
    browser.restart();
  ***REMOVED***
***REMOVED***
