// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const ***REMOVED***SpecReporter***REMOVED*** = require('jasmine-spec-reporter');
const fs = require('fs');
let rawdata = fs.readFileSync('e2e/environment.json');
let credentials = JSON.parse(rawdata);

exports.config = ***REMOVED***
    seleniumAddress: 'http://localhost:4444/wd/hub',
    params: ***REMOVED***
        timeout: credentials['timeout'],

        portal: credentials['portal'],
        login: ***REMOVED***
            email_user: credentials['email_user'],
            password_user: credentials['password_user'],
            email_fm: credentials['email_fm'],
            password_fm: credentials['password_fm'],
            email_vo: credentials['email_vo'],
            password_vo: credentials['password_vo'],
            auth_user: credentials['auth_user'],
            auth_fm: credentials['auth_fm'],
            auth_vo: credentials['auth_vo']


        ***REMOVED***
    ***REMOVED***,
    allScriptsTimeout: 11000,
    specs: [
        'tests_ts/simple_vm_application_test.ts',
        'tests_ts/simple_vm_approval_test.ts',
        'tests_ts/simple_vm_modification_test.ts',
    ],
    capabilities: ***REMOVED***
        'browserName': 'chrome',
        chromeOptions: ***REMOVED***
            args: ["--incognito"]
        ***REMOVED***
    ***REMOVED***,
    directConnect: true,
    framework: 'jasmine',
    jasmineNodeOpts: ***REMOVED***
        showColors: true,
        defaultTimeoutInterval: 30000,
        print: function () ***REMOVED***
        ***REMOVED***
    ***REMOVED***,
    beforeLaunch: function () ***REMOVED***
        require('ts-node').register(***REMOVED***
            project: 'e2e/tsconfig.e2e.json'
        ***REMOVED***);
    ***REMOVED***,
    onPrepare() ***REMOVED***
        jasmine.getEnv().addReporter(new SpecReporter(***REMOVED***spec: ***REMOVED***displayStacktrace: true***REMOVED******REMOVED***));
        browser.manage().window().setSize(1920, 1080);
    ***REMOVED***
***REMOVED***;
