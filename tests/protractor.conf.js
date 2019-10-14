// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {SpecReporter} = require('jasmine-spec-reporter');
const fs = require('fs');
let rawdata = fs.readFileSync('e2e/environment.json');
let credentials = JSON.parse(rawdata);

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  params: {
    timeout: credentials['timeout'],

    portal: credentials['portal'],
    login: {
      email_user: credentials['email_user'],
      password_user: credentials['password_user'],
      email_fm: credentials['email_fm'],
      password_fm: credentials['password_fm'],
      email_vo: credentials['email_vo'],
      password_vo: credentials['password_vo'],
      auth: credentials['auth']
    }
  },
  allScriptsTimeout: 11000,
  specs: [
    'login_test.ts', 'cloud_application_test.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: ["--incognito"]
    }
  },
  directConnect: true,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () {
    }
  },
  beforeLaunch: function () {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
    browser.manage().window().setSize(1920, 1080);
  }
};
