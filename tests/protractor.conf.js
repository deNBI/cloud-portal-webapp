// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {SpecReporter} = require('jasmine-spec-reporter');
const fs = require('fs');
let rawdata = fs.readFileSync('tests/environment.json');
let credentials = JSON.parse(rawdata);

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    params: {
    timeout: 10000,
    
    portal: 'http://portal-dev.denbi.de:8000',
    login: {
      email: credentials['email'],
      password: credentials['password'],
      auth: 'google'
    }
  },
  allScriptsTimeout: 11000,
  specs: [
    'cloud_application_test.ts'
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
      browser.manage().window().setSize(1600, 1000);
  }
};
